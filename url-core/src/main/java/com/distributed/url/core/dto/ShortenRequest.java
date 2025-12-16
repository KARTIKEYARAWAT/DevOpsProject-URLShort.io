package com.distributed.url.core.dto;

public class ShortenRequest {
    private String originalUrl;
    private String customAlias;

    public ShortenRequest() {
    }

    public ShortenRequest(String originalUrl) {
        this.originalUrl = originalUrl;
    }

    public ShortenRequest(String originalUrl, String customAlias) {
        this.originalUrl = originalUrl;
        this.customAlias = customAlias;
    }

    public String getOriginalUrl() {
        return originalUrl;
    }

    public void setOriginalUrl(String originalUrl) {
        this.originalUrl = originalUrl;
    }

    public String getCustomAlias() {
        return customAlias;
    }

    public void setCustomAlias(String customAlias) {
        this.customAlias = customAlias;
    }
}
