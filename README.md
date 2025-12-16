# Distributed URL Shortener System

A high-performance, scalable, and distributed URL shortening service built with **Java Spring Boot** and **React**. This project demonstrates advanced distributed system concepts like **Consistent Hashing**, **Sharding**, and **Fault Tolerance**.

---

## 🚀 Architecture Overview

The system is composed of multiple decoupled microservices that work together to handle high throughput and ensure data availability.

### High-Level Data Flow
1.  **Client (React Frontend)** sends a URL to the **Dashboard (BFF)**.
2.  **Dashboard** generates a unique Short Key and queries the **Router**.
3.  **Router** uses **Consistent Hashing** to determine which **Storage Node** (Data Shard) owns that key.
4.  **Dashboard** forwards the data to the identified **Storage Node**.
5.  **Storage Node** persists the mapping in memory.

---

## 📦 Project Modules

### 1. URL Core (`url-core`)
**The Shared Foundation**
- **Purpose**: A shared library containing common data models, constants, and utility classes.
- **Key Components**:
    - `ShortObj`: The data entity for URL mappings.
    - `HashUtils`: Implementation of the MurmurHash3 algorithm for consistent distribution.
    - `CommonConstants`: Shared configuration keys.

### 2. URL Router (`url-router`)
**The Brain of the Cluster**
- **Purpose**: Manages the consistent hash ring and tracks the health of all storage nodes.
- **Key Features**:
    - **Consistent Hashing Ring**: Maps keys and nodes to a circular keyspace to minimize data movement during scaling.
    - **Heartbeat Monitor**: Periodically checks if nodes are alive.
    - **Dynamic Rebalancing**: Automatically adjusts the ring when nodes join or leave.

### 3. URL Node (`url-node`)
**The Storage Units (Data Shards)**
- **Purpose**: Lightweight, independent servers that store the actual URL mappings.
- **Key Features**:
    - **In-Memory Storage**: Uses `ConcurrentHashMap` for O(1) access.
    - **Shared-Nothing**: Nodes do not know about each other; they only report to the Router.
    - **Scalability**: You can run as many Node instances as needed to spread the load.

### 4. URL Dashboard - Backend (`url-dashboard`)
**The API Gateway**
- **Purpose**: Acts as the Backend-for-Frontend (BFF) and entry point for clients.
- **Key Features**:
    - **ID Generation**: Generates unique short keys.
    - **Coordination**: Bridges the communication between the Client, Router, and Nodes.
    - **Public API**: Exposes REST endpoints (`/api/shorten`, `/api/nodes`) for the frontend.

### 5. React Dashboard - Frontend (`react-dashboard`)
**The User Interface**
- **Purpose**: A modern web interface to interact with the system and visualize cluster health.
- **Key Features**:
    - **3D Visuals & Glassmorphism**: Built with Tailwind CSS and Framer Motion.
    - **Real-Time Monitoring**: Shows which Data Shards are online/offline.
    - **Source Code Preview**: Built-in viewer to inspect the project's Java code.
    - **Documentation**: Embedded architecture and usage guides.

---

## 🛠️ Getting Started

### Prerequisites
- Java 21+
- Maven 3.8+
- Node.js 18+

### 1. Build All Java Modules
Navigate to the root directory and build the project:
```bash
mvn clean install
```

### 2. Start the System
You need to start the components in the following order:

1.  **Start Router**:
    ```bash
    java -jar url-router/target/url-router-1.0-SNAPSHOT.jar
    ```
2.  **Start Data Shards (Nodes)**:
    Open multiple terminals and run:
    ```bash
    java -jar url-node/target/url-node-1.0-SNAPSHOT.jar --server.port=8081 --node.id=NODE_A
    java -jar url-node/target/url-node-1.0-SNAPSHOT.jar --server.port=8082 --node.id=NODE_B
    ```
3.  **Start Backend Dashboard**:
    ```bash
    java -jar url-dashboard/target/url-dashboard-1.0-SNAPSHOT.war
    ```
4.  **Start Frontend**:
    ```bash
    cd react-dashboard
    npm install
    npm run dev
    ```

### 3. Usage
- Open **http://localhost:3000** in your browser.
- Enter a long URL to shorten it.
- Observe the **Node Cluster** widget to see which Data Shard stored your key.

---

## 📚 Documentation
For more detailed information, check the **Structure** and **Maven Docs** sections in the application sidebar.
