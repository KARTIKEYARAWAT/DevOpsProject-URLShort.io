package com.distributed.url.router.service;

import com.distributed.url.core.util.HashUtil;
import org.springframework.stereotype.Service;
import java.util.*;
import java.util.concurrent.ConcurrentSkipListMap;

@Service
public class ConsistentHashRing {

    // Sorted Map: Hash -> Node URL
    private final ConcurrentSkipListMap<Integer, String> circle = new ConcurrentSkipListMap<>();
    private final List<String> nodes = new ArrayList<>();
    private final Set<String> deadNodes = new HashSet<>();
    private final int VIRTUAL_NODES = 5; // Replicas on ring per physical node

    public ConsistentHashRing() {
        // Initial nodes
        addNode("http://localhost:8081");
        addNode("http://localhost:8082");
        addNode("http://localhost:8083");
    }

    public void addNode(String nodeUrl) {
        nodes.add(nodeUrl);
        deadNodes.remove(nodeUrl);
        for (int i = 0; i < VIRTUAL_NODES; i++) {
            circle.put(HashUtil.getHash(nodeUrl + "-" + i), nodeUrl);
        }
        System.out.println("Added node: " + nodeUrl);
    }

    public void removeNode(String nodeUrl) {
        if (!deadNodes.contains(nodeUrl)) {
            deadNodes.add(nodeUrl);
            // We don't remove from 'nodes' list to keep track, but we remove from circle
            for (int i = 0; i < VIRTUAL_NODES; i++) {
                circle.remove(HashUtil.getHash(nodeUrl + "-" + i));
            }
            System.out.println("Removed node from ring: " + nodeUrl);
        }
    }

    public String getNode(String key) {
        if (circle.isEmpty())
            return null;
        int hash = HashUtil.getHash(key);
        Map.Entry<Integer, String> entry = circle.ceilingEntry(hash);
        if (entry == null) {
            entry = circle.firstEntry();
        }
        return entry.getValue();
    }

    // Get backup node (next one in ring)
    public String getNextNode(String key, String primaryNode) {
        if (circle.size() <= VIRTUAL_NODES)
            return null; // Only one physical node exists

        int hash = HashUtil.getHash(key);
        // Find positions
        Map.Entry<Integer, String> entry = circle.ceilingEntry(hash);
        if (entry == null)
            entry = circle.firstEntry();

        // Iterator to find next DISTINCT physical node
        // In a real impl, we'd iterate the circle. For simplicity, we just look
        // forward.
        // Actually, we can just jump on the circle map keys.

        NavigableMap<Integer, String> tailMap = circle.tailMap(entry.getKey(), false);
        for (String node : tailMap.values()) {
            if (!node.equals(primaryNode))
                return node;
        }
        // Wrap around
        for (String node : circle.values()) {
            if (!node.equals(primaryNode))
                return node;
        }
        return null; // Should not happen if >1 nodes
    }

    public List<String> getAllNodes() {
        return nodes;
    }

    public boolean isHealthy(String node) {
        return !deadNodes.contains(node);
    }
}
