package com.distributed.url.core.dto;

public class NodeShortenRequest {
    private String originalUrl;
    private String shortKey;
    private String replicateTo;

    public NodeShortenRequest() {
    }

    public NodeShortenRequest(String originalUrl, String shortKey, String replicateTo) {
        this.originalUrl = originalUrl;
        this.shortKey = shortKey;
        this.replicateTo = replicateTo;
    }

    public String getOriginalUrl() {
        return originalUrl;
    }

    public void setOriginalUrl(String originalUrl) {
        this.originalUrl = originalUrl;
    }

    public String getShortKey() {
        return shortKey;
    }

    public void setShortKey(String shortKey) {
        this.shortKey = shortKey;
    }

    public String getReplicateTo() {
        return replicateTo;
    }

    public void setReplicateTo(String replicateTo) {
        this.replicateTo = replicateTo;
    }
}
