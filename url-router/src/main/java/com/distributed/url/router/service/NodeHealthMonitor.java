package com.distributed.url.router.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class NodeHealthMonitor {

    @Autowired
    private ConsistentHashRing ring;

    private final RestTemplate restTemplate = new RestTemplate();

    @Scheduled(fixedRate = 5000)
    public void checkHealth() {
        for (String node : ring.getAllNodes()) {
            try {
                restTemplate.getForEntity(node + "/api/node/health", String.class);
                // If success, ensure it's in the ring (logic triggers if it WAS dead)
                if (!ring.isHealthy(node)) {
                    ring.addNode(node);
                    System.out.println("Node recovered: " + node);
                }
            } catch (Exception e) {
                // Determine if it was healthy before
                if (ring.isHealthy(node)) {
                    System.err.println("Node FAILED: " + node);
                    ring.removeNode(node);
                }
            }
        }
    }
}
