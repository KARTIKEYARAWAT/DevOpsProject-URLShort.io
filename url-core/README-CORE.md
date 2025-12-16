# URL Core Module

## Overview
The **URL Core** module is the foundational shared library for the Distributed URL Shortener system. It contains common data models, utility classes, and shared logic used across the Router, Node, and Dashboard services.

## Key Components

### 1. Data Models
- **`ShortObj`**: The primary entity representing a shortened URL.
    - `originalUrl`: The actual long URL.
    - `shortKey`: The unique 7-character hash.
    - `createdAt`: Timestamp.
    - `accessCount`: Usage statistics.

### 2. Utilities
- **`HashUtils`**: Implementation of MurmurHash3 or similar hashing algorithms for consistent hashing distribution.
- **`CommonConstants`**: Shared configuration keys and default values.

## Usage
This module is imported as a Maven dependency in other modules:
```xml
<dependency>
    <groupId>com.example</groupId>
    <artifactId>url-core</artifactId>
    <version>1.0-SNAPSHOT</version>
</dependency>
```

## Build
```bash
mvn clean install
```
