const fs = require('fs');
const path = require('path');

// Configuration
const projectRoot = path.resolve(__dirname, '../../'); // Root of MavenProject
const frontendPublic = path.resolve(__dirname, '../public/source-code');

const items = [
    { name: 'Root Project', path: 'pom.xml', type: 'file' },
    { name: 'url-node', path: 'url-node/pom.xml', type: 'file' },
    { name: 'url-router', path: 'url-router/pom.xml', type: 'file' },
    { name: 'url-dashboard', path: 'url-dashboard/pom.xml', type: 'file' },
    { name: 'url-core', path: 'url-core/pom.xml', type: 'file' }
];

// Ensure output directory exists
if (fs.existsSync(frontendPublic)) {
    fs.rmSync(frontendPublic, { recursive: true, force: true });
}
fs.mkdirSync(frontendPublic, { recursive: true });

const manifest = [];

console.log('Generating POM Map...');

for (const item of items) {
    const sourcePath = path.join(projectRoot, item.path);
    if (fs.existsSync(sourcePath)) {
        console.log(`Processing ${item.name}...`);

        // Create a simplified structure for the viewer
        // For files, we just copy them. Use unique names if needed, or preserve directory structure.
        // Let's preserve directory structure to avoid collisions (e.g. multiple pom.xml)

        const destRelativePath = item.path;
        const destPath = path.join(frontendPublic, destRelativePath);

        fs.mkdirSync(path.dirname(destPath), { recursive: true });
        fs.copyFileSync(sourcePath, destPath);

        manifest.push({
            name: item.name,
            type: 'file',
            path: destRelativePath.replace(/\\/g, '/'),
            language: 'xml'
        });
    } else {
        console.warn(`Warning: POM not found for ${item.name}: ${sourcePath}`);
    }
}

// Write manifest
fs.writeFileSync(path.join(frontendPublic, 'manifest.json'), JSON.stringify(manifest, null, 2));
console.log('Manifest generated at public/source-code/manifest.json');
