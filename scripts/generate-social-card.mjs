import sharp from "sharp";
import { writeFile } from "node:fs/promises";

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
<rect width="1200" height="630" fill="#faf7f4"/>
<path d="M72 72h1056M72 558h1056" stroke="#ddcfbf"/>
<rect x="72" y="111" width="12" height="12" fill="#ff8214"/>
<text x="100" y="123" font-family="monospace" font-size="18" letter-spacing="2" fill="#525252">LINUX · OPEN SOURCE · TRAIL RUNNING</text>
<text x="68" y="280" font-family="sans-serif" font-weight="bold" font-size="100" letter-spacing="-5" fill="#0a0a0a">Miguel Vila<tspan fill="#a44713">_</tspan></text>
<text x="72" y="358" font-family="sans-serif" font-size="32" fill="#525252">Converting caffeine into low quality code since 2003!</text>
<text x="72" y="512" font-family="monospace" font-size="24" fill="#a44713">miguelovila.pt</text>
<g stroke="#ddcfbf" fill="none"><path d="M900 416h160v96H900zM932 416v96m32-96v96m32-96v96m32-96v96m-128-64h160m-160 32h160"/></g>
<rect x="932" y="448" width="32" height="32" fill="#ff8214"/><rect x="996" y="480" width="32" height="32" fill="#a44713"/>
</svg>`;
await writeFile("public/images/social-card.svg", svg);
await sharp(Buffer.from(svg)).png().toFile("public/images/social-card.png");
console.log("Generated public/images/social-card.png (1200 × 630)");
