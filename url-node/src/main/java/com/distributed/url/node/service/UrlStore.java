package com.distributed.url.node.service;

import org.springframework.stereotype.Service;
import java.util.concurrent.ConcurrentHashMap;
import java.util.Map;

@Service
public class UrlStore {
    private final Map<String, String> store = new ConcurrentHashMap<>();

    public void save(String key, String url) {
        store.put(key, url);
    }

    public String get(String key) {
        return store.get(key);
    }

    public Map<String, String> getAll() {
        return store;
    }
}
