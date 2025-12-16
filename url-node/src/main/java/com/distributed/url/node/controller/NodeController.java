package com.distributed.url.node.controller;

import com.distributed.url.core.dto.NodeShortenRequest;
import com.distributed.url.core.dto.ShortenResponse;
import com.distributed.url.node.service.UrlStore;
import com.distributed.url.core.util.HashUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.ResponseEntity;
import java.util.Map;

@RestController
@RequestMapping("/api/node")
public class NodeController {

    @Autowired
    private UrlStore urlStore;

    private final RestTemplate restTemplate = new RestTemplate();

    @PostMapping("/shorten")
    public ShortenResponse shorten(@RequestBody NodeShortenRequest request) {
        String key;
        if (request.getShortKey() != null) {
            key = request.getShortKey();
        } else {
            // Generate simple hash or random key if not provided (Primary Node logic)
            // For simplicity, using HashUtil on the URL + timestamp to ensure uniqueness or
            // just Hash(URL)
            // But for distributed, we prefer Router given ID or consistent generation.
            // Let's assume Router generates Key OR Node generates.
            // Requirement says "Consistent Hashing for node selection", doesn't specify Key
            // gen.
            // I'll make the KEY derived from URL for now.
            key = Integer.toHexString(HashUtil.getHash(request.getOriginalUrl()));
        }

        urlStore.save(key, request.getOriginalUrl());
        System.out.println("Stored key=" + key + " val=" + request.getOriginalUrl());

        // Replication
        if (request.getReplicateTo() != null && !request.getReplicateTo().isEmpty()) {
            try {
                // Call replica
                NodeShortenRequest replicaReq = new NodeShortenRequest(request.getOriginalUrl(), key, null);
                String replicaUrl = request.getReplicateTo() + "/api/node/shorten";
                System.out.println("Replicating to: " + replicaUrl);
                restTemplate.postForEntity(replicaUrl, replicaReq, ShortenResponse.class);
            } catch (Exception e) {
                System.err.println("Replication failed: " + e.getMessage());
            }
        }

        return new ShortenResponse(key, request.getOriginalUrl(), "LocalNode", request.getShortKey() != null);
    }

    @GetMapping("/lookup/{key}")
    public ResponseEntity<String> lookup(@PathVariable String key) {
        String url = urlStore.get(key);
        if (url != null) {
            return ResponseEntity.ok(url);
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/health")
    public ResponseEntity<String> health() {
        return ResponseEntity.ok("UP");
    }

    @GetMapping("/stats")
    public Map<String, String> stats() {
        return urlStore.getAll();
    }
}
