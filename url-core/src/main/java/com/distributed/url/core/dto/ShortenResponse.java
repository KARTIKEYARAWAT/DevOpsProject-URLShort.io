package com.distributed.url.core.dto;

public class ShortenResponse {
    private String shortKey;
    private String originalUrl;
    private String nodeAddress;
    private boolean replica;

    public ShortenResponse() {
    }

    public ShortenResponse(String shortKey, String originalUrl, String nodeAddress, boolean replica) {
        this.shortKey = shortKey;
        this.originalUrl = originalUrl;
        this.nodeAddress = nodeAddress;
        this.replica = replica;
    }

    public String getShortKey() {
        return shortKey;
    }

    public void setShortKey(String shortKey) {
        this.shortKey = shortKey;
    }

    public String getOriginalUrl() {
        return originalUrl;
    }

    public void setOriginalUrl(String originalUrl) {
        this.originalUrl = originalUrl;
    }

    public String getNodeAddress() {
        return nodeAddress;
    }

    public void setNodeAddress(String nodeAddress) {
        this.nodeAddress = nodeAddress;
    }

    public boolean isReplica() {
        return replica;
    }

    public void setReplica(boolean replica) {
        this.replica = replica;
    }
}
