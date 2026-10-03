const sharp = require('sharp');
const fs = require('fs');

async function createOgImage() {
  const svg = `
  <svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
    <rect width="1200" height="630" fill="#0a0b0d" />
    <defs>
      <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
        <path d="M 60 0 L 0 0 0 60" fill="none" stroke="#ffffff" stroke-width="1" stroke-opacity="0.04" />
      </pattern>
    </defs>
    <rect width="1200" height="630" fill="url(#grid)" />
    
    <rect x="30" y="30" width="1140" height="570" fill="none" stroke="#ffffff" stroke-opacity="0.12" stroke-width="1" />
    <rect x="36" y="36" width="1128" height="558" fill="none" stroke="#c47d48" stroke-opacity="0.2" stroke-width="1" />

    <text x="80" y="100" font-family="monospace, system-ui" font-size="14" font-weight="600" letter-spacing="5" fill="#c47d48">CIVIL &amp; STRUCTURAL ENGINEERING</text>
    
    <g transform="translate(80, 150) scale(2.4)">
      <path fill="#c47d48" d="M 0,26 C 15,26 22,14 36,14 C 44,14 47,21 50,26 C 53,21 56,14 64,14 C 78,14 85,26 100,26 L 100,34 C 85,34 78,22 64,22 C 56,22 53,29 50,34 C 47,29 44,22 36,22 C 22,22 15,34 0,34 Z" />
      <path fill="#ffffff" d="M 0,38 C 15,38 22,26 36,26 C 44,26 47,33 50,38 C 53,33 56,26 64,26 C 78,26 85,38 100,38 L 100,46 C 85,46 78,34 64,34 C 56,34 53,41 50,46 C 47,41 44,34 36,34 C 22,34 15,46 0,46 Z" />
      <path fill="#ffffff" d="M 0,50 C 15,50 22,38 36,38 C 44,38 47,45 50,50 C 53,45 56,38 64,38 C 78,38 85,50 100,50 L 100,58 C 85,58 78,46 64,46 C 56,46 53,53 50,58 C 47,53 44,46 36,46 C 22,46 15,58 0,58 Z" />
      <path fill="#ffffff" d="M 0,62 C 15,62 22,50 36,50 C 44,50 47,57 50,62 C 53,57 56,50 64,50 C 78,50 85,62 100,62 L 100,70 C 85,70 78,58 64,58 C 56,58 53,65 50,70 C 47,65 44,58 36,58 C 22,58 15,70 0,70 Z" />
      <path fill="#ffffff" d="M 0,74 C 15,74 22,62 36,62 C 44,62 47,69 50,74 C 53,69 56,62 64,62 C 78,62 85,74 100,74 L 100,80 L 74,80 C 64,80 57,75 50,75 C 43,75 36,80 26,80 L 0,80 Z" />
    </g>

    <text x="360" y="240" font-family="system-ui, -apple-system, sans-serif" font-size="56" font-weight="800" letter-spacing="6" fill="#ffffff">MAPLE</text>
    <text x="360" y="285" font-family="system-ui, -apple-system, sans-serif" font-size="24" font-weight="600" letter-spacing="8" fill="rgba(255,255,255,0.7)">CONSULTING ENGINEERS</text>
    
    <text x="80" y="410" font-family="serif, Times New Roman" font-size="34" font-style="italic" fill="#ffffff">Delivering excellence in structural design &amp; engineering innovation.</text>
    <text x="80" y="460" font-family="system-ui, -apple-system, sans-serif" font-size="18" font-weight="400" fill="rgba(255,255,255,0.6)">High-Rise Buildings • PEB Industrial Structures • Seismic Analysis • Structural Rehabilitation</text>

    <line x1="80" y1="510" x2="1120" y2="510" stroke="#ffffff" stroke-opacity="0.1" stroke-width="1" />
    <text x="80" y="555" font-family="monospace, system-ui" font-size="15" font-weight="500" letter-spacing="3" fill="#c47d48">CALICUT • KOCHI • PALAKKAD • BENGALURU</text>
    <text x="1120" y="555" text-anchor="end" font-family="monospace, system-ui" font-size="15" font-weight="600" letter-spacing="3" fill="#ffffff">MAPLECE.COM</text>
  </svg>
  `;

  await sharp(Buffer.from(svg)).jpeg({ quality: 90 }).toFile('public/og-image.jpg');
  console.log('OG image created successfully: public/og-image.jpg');
}

createOgImage().catch(console.error);
