const ROUTER_API = "http://localhost:8080/api";

function shortenUrl() {
    const originalUrl = document.getElementById('urlInput').value;
    if (!originalUrl) return alert("Please enter a URL");

    fetch(`${ROUTER_API}/shorten`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ originalUrl: originalUrl })
    })
        .then(response => response.json())
        .then(data => {
            document.getElementById('resultArea').style.display = 'block';
            const link = `${ROUTER_API}/${data.shortKey}`; // Direct via router
            const a = document.getElementById('shortLink');
            a.href = link;
            a.innerText = link;
            document.getElementById('nodeHandler').innerText = data.nodeAddress;
            document.getElementById('isReplica').innerText = data.replica ? "Yes" : "No";
            refreshNodes();
        })
        .catch(err => alert("Error shortening URL: " + err));
}

function refreshNodes() {
    fetch(`${ROUTER_API}/nodes`)
        .then(res => res.json())
        .then(data => {
            const list = document.getElementById('nodeList');
            list.innerHTML = '';
            let onlineCount = 0;
            let offlineCount = 0;

            data.nodes.forEach(node => {
                if (node.status === 'Online') onlineCount++; else offlineCount++;

                const div = document.createElement('div');
                div.className = `node-item ${node.status.toLowerCase()}`;
                div.innerHTML = `
                <span>${node.url}</span>
                <span>${node.status} (${node.keys} keys)</span>
            `;
                list.appendChild(div);
            });

            updateChart(onlineCount, offlineCount);
        })
        .catch(console.error);
}

let healthChart = null;

function updateChart(online, offline) {
    const ctx = document.getElementById('healthChart').getContext('2d');
    if (healthChart) healthChart.destroy();

    healthChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Online', 'Offline'],
            datasets: [{
                data: [online, offline],
                backgroundColor: ['#00ff00', '#ff0055'],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { position: 'bottom', labels: { color: 'white' } }
            }
        }
    });
}

function downloadDocs() {
    // In a real app, this would be a real file.
    // We created dummy logic. 
    // Just trigger a download of a text file or attempt to open pdf
    // Since we created the file, let's link to it if we were serving it correctly.
    // For now, alert.
    alert("Downloading Project Insight PDF...");
    window.open("docs/project-insight.pdf");
}

// Auto refresh
setInterval(refreshNodes, 3000);
refreshNodes();
