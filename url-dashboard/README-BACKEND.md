# URL Dashboard (Backend)

## Overview
The **URL Dashboard** acts as the Backend-for-Frontend (BFF) and the public-facing API Gateway. It aggregates data from the Router and Nodes to present a unified view to the React Frontend. It also handles the actual URL shortening requests by coordinating with the Router.

## Responsibilities
- **API Gateway**: Exposes REST endpoints for the React frontend.
- **ID Generation**: Generates unique short keys (e.g., Base62 encoding).
- **Coordination**:
    1. Generates Key.
    2. Queries Router for the correct Node.
    3. Forwards storage request to that Node.

## Tech Stack
- **Java 21**
- **Spring Boot 3**
- **Spring MVC**
- **Maven**

## API Endpoints (Public)

- `POST /api/shorten`: Create a short link.
- `GET /api/nodes`: Get cluster health status.
- `GET /{shortKey}`: Redirect to original URL (302 Found).

## Running
```bash
mvn spring-boot:run
# OR
java -jar target/url-dashboard-1.0-SNAPSHOT.war
```
