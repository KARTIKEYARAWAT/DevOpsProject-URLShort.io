@echo off
echo Starting Distributed URL Shortener System...

start "Node 1" java -jar url-node/target/url-node-1.0-SNAPSHOT.war --server.port=8081
start "Node 2" java -jar url-node/target/url-node-1.0-SNAPSHOT.war --server.port=8082
start "Node 3" java -jar url-node/target/url-node-1.0-SNAPSHOT.war --server.port=8083

timeout /t 5

start "Router" java -jar url-router/target/url-router-1.0-SNAPSHOT.war

timeout /t 5

start "Dashboard" java -jar url-dashboard/target/url-dashboard-1.0-SNAPSHOT.war

echo All services started!
echo Dashboard: http://localhost:8085
echo Router: http://localhost:8080
pause
