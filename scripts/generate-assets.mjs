import { execSync } from 'child_process';
import path from 'path';
import fs from 'fs';

const IMG_DIR = 'static/img';
const TARGET_DIR = 'static/img'; // Write back to same dir for now to replace existing ones

const assets = [
    { name: 'common-bond-logo', width: 1200 },
    { name: 'common-bond-mark', width: 512 },
    { name: 'common-bond-rebrand-horizontal', width: 1200 },
    { name: 'common-bond-rebrand-stacked', width: 800 },
    { name: 'common-bond-tagline', width: 1200 }
];

// Add iterations
for (let i = 1; i <= 20; i++) {
    assets.push({ name: `iterations/iteration_${i}`, width: 800 });
}

console.log('🚀 Generating branding PNGs from SVGs...');

assets.forEach(asset => {
    const input = path.join(IMG_DIR, `${asset.name}.svg`);
    const output = path.join(TARGET_DIR, `${asset.name}.png`);

    if (fs.existsSync(input)) {
        try {
            console.log(`  - Processing ${asset.name}...`);
            // Use sharp-cli to perform conversion
            execSync(`npx -y sharp-cli -i ${input} -o ${output} resize ${asset.width}`, { stdio: 'inherit' });
        } catch (error) {
            console.error(`  ❌ Error processing ${asset.name}:`, error.message);
        }
    } else {
        console.warn(`  - Skipping ${asset.name} (SVG not found)`);
    }
});

console.log('✅ Asset generation complete.');
