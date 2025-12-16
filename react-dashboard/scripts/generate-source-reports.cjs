const fs = require('fs');
const path = require('path');

// Configuration
const projectRoot = path.resolve(__dirname, '../../');
const publicDocs = path.resolve(__dirname, '../public/docs');

const modules = [
    { name: 'url-node', path: 'url-node/src/main/java' },
    { name: 'url-router', path: 'url-router/src/main/java' },
    { name: 'url-dashboard', path: 'url-dashboard/src/main/java' }
];

// Ensure output directory exists
if (!fs.existsSync(publicDocs)) {
    fs.mkdirSync(publicDocs, { recursive: true });
}

function scanDirectory(dirPath) {
    let files = [];
    const items = fs.readdirSync(dirPath, { withFileTypes: true });

    for (const item of items) {
        const itemPath = path.join(dirPath, item.name);
        if (item.isDirectory()) {
            files = files.concat(scanDirectory(itemPath));
        } else if (item.isFile() && item.name.endsWith('.java')) {
            files.push(itemPath);
        }
    }
    return files;
}

console.log('Generating Source Reports...');

for (const module of modules) {
    const moduleSourcePath = path.join(projectRoot, module.path);
    const outputFile = path.join(publicDocs, `source-${module.name}.html`);

    if (fs.existsSync(moduleSourcePath)) {
        console.log(`Processing ${module.name}...`);
        const javaFiles = scanDirectory(moduleSourcePath);

        let htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Source Code: ${module.name}</title>
    <style>
        body { font-family: 'Courier New', Courier, monospace; background-color: #0f111a; color: #a9b1d6; padding: 20px; line-height: 1.6; }
        h1 { color: #7aa2f7; text-align: center; border-bottom: 2px solid #7aa2f7; padding-bottom: 10px; }
        .file-block { margin-bottom: 40px; border: 1px solid #292e42; border-radius: 8px; overflow: hidden; }
        .file-header { background-color: #1a1b26; padding: 10px 20px; border-bottom: 1px solid #292e42; color: #bb9af7; font-weight: bold; display: flex; justify-content: space-between; align-items: center; }
        pre { margin: 0; padding: 20px; overflow-x: auto; background-color: #0f111a; }
        code { font-size: 24px; }
        .copy-btn { background: #7aa2f7; color: #1a1b26; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer; font-weight: bold; }
        .copy-btn:hover { background: #bb9af7; }
    </style>
</head>
<body>
    <h1>${module.name} - Source Code Report</h1>
    <script>
        function copyCode(btn) {
            const pre = btn.closest('.file-block').querySelector('pre');
            const code = pre.innerText;
            navigator.clipboard.writeText(code).then(() => {
                const originalText = btn.innerText;
                btn.innerText = 'Copied!';
                setTimeout(() => btn.innerText = originalText, 2000);
            });
        }
    </script>
`;

        for (const filePath of javaFiles) {
            const relativePath = path.relative(moduleSourcePath, filePath).replace(/\\/g, '/');
            const content = fs.readFileSync(filePath, 'utf-8')
                .replace(/&/g, "&amp;")
                .replace(/</g, "&lt;")
                .replace(/>/g, "&gt;");

            htmlContent += `
    <div class="file-block">
        <div class="file-header">
            <span>${relativePath}</span>
            <button class="copy-btn" onclick="copyCode(this)">Copy</button>
        </div>
        <pre><code>${content}</code></pre>
    </div>
`;
        }

        htmlContent += `
</body>
</html>`;

        fs.writeFileSync(outputFile, htmlContent);
        console.log(`Generated: ${outputFile}`);
    } else {
        console.warn(`Warning: Source path not found for ${module.name}`);
    }
}
