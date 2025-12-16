# URL Node (Storage Service)

## Overview
The **URL Node** is the storage unit of the Distributed URL Shortener. It is a lightweight, high-performance service responsible for storing and retrieving URL mappings. In a production environment, multiple instance of this node run in parallel, each responsible for a shard of the data.

## Architecture
- **Type**: independent Microservice
- **Communication**: REST API (Spring Boot Web)
- **Sustainability**: Stateless / Shared-Nothing Architecture

## Features
- **In-Memory Storage**: Uses specialized concurrent data structures for O(1) read/write access.
- **Heartbeat**: Periodically signals its "Online" status to the Router.
- **Replication**: (Optional) Can act as a replica for another node for fault tolerance.

## API Endpoints

### `POST /api/store`
Stores a new URL mapping.
- **Body**: `{ "shortKey": "abc1234", "originalUrl": "https://..." }`
- **Response**: `200 OK`

### `GET /api/fetch/{shortKey}`
Retrieves the original URL.
- **Response**: `{ "originalUrl": "https://..." }`

## Configuration
Inside `application.properties`:
```properties
server.port=8081  # Port varies by node instance
node.id=NODE_1
router.url=http://localhost:8082
```

## Running
```bash
java -jar target/url-node-1.0-SNAPSHOT.jar
```
