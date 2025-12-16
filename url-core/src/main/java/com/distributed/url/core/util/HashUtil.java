package com.distributed.url.core.util;

import com.google.common.hash.Hashing;
import java.nio.charset.StandardCharsets;

public class HashUtil {
    
    // Consistent Hashing usually maps nodes and keys to a ring (int/long space)
    public static int getHash(String key) {
        return Hashing.murmur3_32_fixed().hashString(key, StandardCharsets.UTF_8).asInt();
    }
}
