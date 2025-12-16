# URL Router

## Overview
The **URL Router** is the intelligent "brain" of the system. It implements the **Consistent Hashing** algorithm to distribute URL keys uniformly across available storage nodes. It handles node discovery, health checks, and request routing.

## Key Features
- **Consistent Hashing Ring**: Maps both Servers and Keys to a 32-bit integer space (the "Ring").
- **Dynamic Scaling**: Automatically detects when nodes join or leave the cluster and rebalances the mapping.
- **Heartbeat Monitor**: Maintains a pulse on all storage nodes to ensure high availability.
- **Virtual Nodes**: Implements virtual node replicas to ensure even distribution of data.

## API Endpoints

### `GET /api/router/cluster`
Returns the current state of the hash ring and active nodes.

### `POST /api/router/register`
Endpoint for storage nodes to register themselves upon startup.

## How it Works
1. **Client** sends specific URL to Dashboard.
2. **Dashboard** asks **Router**: "Which node handles key 'abc'?"
3. **Router** computes `Hash('abc')` and finds the successor node on the ring.
4. **Router** returns the node's address (e.g., `http://localhost:8081`).

## Build & Run
```bash
mvn clean package
java -jar target/url-router-1.0-SNAPSHOT.jar
```
