package com.distributed.url.router.controller;

import com.distributed.url.core.dto.ShortenRequest;
import com.distributed.url.core.dto.NodeShortenRequest;
import com.distributed.url.core.dto.ShortenResponse;
import com.distributed.url.core.util.HashUtil;
import com.distributed.url.router.service.ConsistentHashRing;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import org.springframework.web.servlet.view.RedirectView;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.HashMap;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class RouterController {

    @Autowired
    private ConsistentHashRing ring;

    private final RestTemplate restTemplate = new RestTemplate();

    @PostMapping("/shorten")
    public ShortenResponse shorten(@RequestBody ShortenRequest request) {
        String originalUrl = request.getOriginalUrl();
        // Generate key logic here because we need it for hashing to choose node
        // In real world, we might use a key-generator service.
        // If custom alias is provided, use it. Otherwise, use hash of URL.
        String key;
        if (request.getCustomAlias() != null && !request.getCustomAlias().isEmpty()) {
            key = request.getCustomAlias();
        } else {
            key = Integer.toHexString(HashUtil.getHash(request.getOriginalUrl()));
        }

        String primaryNode = ring.getNode(key);
        String replicaNode = ring.getNextNode(key, primaryNode);

        if (primaryNode == null) {
            throw new RuntimeException("No nodes available!");
        }

        System.out.println("Routing '" + key + "' to Primary: " + primaryNode + ", Replica: " + replicaNode);

        // Prepare request for Node (tell it to replicate if we want source-routing
        // replication,
        // OR we just call primary and pass replica address)
        NodeShortenRequest nodeReq = new NodeShortenRequest(originalUrl, key, replicaNode);

        try {
            return restTemplate.postForObject(primaryNode + "/api/node/shorten", nodeReq, ShortenResponse.class);
        } catch (Exception e) {
            // If primary fails during this call, try sending directly to replica
            System.err.println("Primary failed during write, trying replica: " + replicaNode);
            if (replicaNode != null) {
                NodeShortenRequest replicaDirectReq = new NodeShortenRequest(originalUrl, key, null);
                return restTemplate.postForObject(replicaNode + "/api/node/shorten", replicaDirectReq,
                        ShortenResponse.class);
            }
            throw e;
        }
    }

    @GetMapping("/{key}")
    public RedirectView redirect(@PathVariable String key) {
        // Logic: Ask Node for URL
        String nodeUrl = ring.getNode(key);
        try {
            String longUrl = restTemplate.getForObject(nodeUrl + "/api/node/lookup/" + key, String.class);
            return new RedirectView(longUrl);
        } catch (Exception e) {
            // Fallback to replica?
            // Need to find replica node logic again
            // Simplified: just try next node
            String replica = ring.getNextNode(key, nodeUrl);
            if (replica != null) {
                try {
                    String longUrl = restTemplate.getForObject(replica + "/api/node/lookup/" + key, String.class);
                    return new RedirectView(longUrl);
                } catch (Exception ex) {
                    // fail
                }
            }
        }
        return new RedirectView("/error");
    }

    @GetMapping("/nodes")
    public Map<String, Object> getNodesStatus() {
        Map<String, Object> status = new HashMap<>();
        List<Map<String, Object>> nodeList = new ArrayList<>();

        for (String node : ring.getAllNodes()) {
            Map<String, Object> nodeInfo = new HashMap<>();
            nodeInfo.put("url", node);
            boolean isHealthy = ring.isHealthy(node);
            nodeInfo.put("status", isHealthy ? "Online" : "Offline");

            if (isHealthy) {
                try {
                    Map<String, String> stats = restTemplate.getForObject(node + "/api/node/stats", Map.class);
                    nodeInfo.put("keys", stats != null ? stats.size() : 0);
                } catch (Exception e) {
                    nodeInfo.put("keys", 0);
                }
            } else {
                nodeInfo.put("keys", 0);
            }
            nodeList.add(nodeInfo);
        }
        status.put("nodes", nodeList);
        status.put("strategy", "Consistent Hashing + Replication");
        return status;
    }
}
