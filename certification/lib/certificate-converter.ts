import React from 'react';

interface CertificateData {
  name: string;
  dateOfIssue: string;
  recipientAddress: string;
}

// Function to escape XML special characters
function escapeXml(unsafe: string): string {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

// Base64 encoded SVG content for the logo
const logoSvgBase64 = 'PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTEwMCAxODUuNzE0QzE0OS4yODUgMTg1LjcxNCAxOTAgMTQ0Ljk5OSAxOTAgOTUuNzE0M0MxOTAgNDYuNDI5NyAxNDkuMjg1IDUuNzE0MjggMTAwIDUuNzE0MjhDNTAuNzE0NyA1LjcxNDI4IDEwIDQ2LjQyOTcgMTAgOTUuNzE0M0MxMCAxNDQuOTk5IDUwLjcxNDcgMTg1LjcxNCAxMDAgMTg1LjcxNFoiIGZpbGw9IiMwNjVGNjYiLz48cGF0aCBkPSJNMTAwIDE2NS43MTRDMTM4LjU3MSAxNjUuNzE0IDE3MCAxMzQuMjg1IDE3MCA5NS43MTQzQzE3MCA1Ny4xNDM2IDEzOC41NzEgMjUuNzE0MyAxMDAgMjUuNzE0M0M2MS40Mjg5IDI1LjcxNDMgMzAgNTcuMTQzNiAzMCA5NS43MTQzQzMwIDEzNC4yODUgNjEuNDI4OSAxNjUuNzE0IDEwMCAxNjUuNzE0WiIgZmlsbD0iI0ZBQ0MxNSIvPjxwYXRoIGQ9Ik0xMDAgMTQ1LjcxNEMxMjcuODU0IDE0NS43MTQgMTUwIDEyMy41NjggMTUwIDk1LjcxNDNDMTUwIDY3Ljg2MDYgMTI3Ljg1NCA0NS43MTQzIDEwMCA0NS43MTQzQzcyLjE0NjQgNDUuNzE0MyA1MCA2Ny44NjA2IDUwIDk1LjcxNDNDNTAgMTIzLjU2OCA3Mi4xNDY0IDE0NS43MTQgMTAwIDE0NS43MTRaIiBmaWxsPSIjMDY1RjY2Ii8+PHBhdGggZD0iTTEwMCAxMjUuNzE0QzExNy4xODUgMTI1LjcxNCAxMzAgMTEyLjg5OSAxMzAgOTUuNzE0M0MxMzAgNzguNTI5NiAxMTcuMTg1IDY1LjcxNDMgMTAwIDY1LjcxNDNDODIuODE0NyA2NS43MTQzIDcwIDc4LjUyOTYgNzAgOTUuNzE0M0M3MCAxMTIuODk5IDgyLjgxNDcgMTI1LjcxNCAxMDAgMTI1LjcxNFoiIGZpbGw9IiNGQUNDMTUiLz48cGF0aCBkPSJNMTAwIDEwNS43MTRDMTA3LjE4NSAxMDUuNzE0IDExMyAxMDAuODk5IDExMyA5NS43MTQzQzExMyA5MC41Mjk2IDEwNy4xODUgODUuNzE0MyAxMDAgODUuNzE0M0M5Mi44MTQ3IDg1LjcxNDMgODcgOTAuNTI5NiA4NyA5NS43MTQzQzg3IDEwMC44OTkgOTIuODE0NyAxMDUuNzE0IDEwMCAxMDUuNzE0WiIgZmlsbD0iIzA2NUY2NiIvPjwvc3ZnPg==';

const generateCertificateSvg = (certificateData: CertificateData): string => {
  const name = escapeXml(certificateData.name);
  const date = escapeXml(certificateData.dateOfIssue);
  const hash = escapeXml(certificateData.recipientAddress);

  // SVG dimensions to match the reference image
  const svgWidth = 900;
  const svgHeight = 650;

  // Color scheme matching the reference
  const emerald800 = "#065f46";
  const yellow400 = "#facc15";
  const gray700 = "#374151";
  const gray600 = "#4b5563";
  const gray400 = "#9ca3af";

  return `<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<svg width="${svgWidth}" height="${svgHeight}" viewBox="0 0 ${svgWidth} ${svgHeight}" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  
  <!-- Background -->
  <rect x="0" y="0" width="${svgWidth}" height="${svgHeight}" fill="white"/>

  <!-- Top Corner Design -->
  <g>
    <path d="M ${svgWidth-200} 0 L ${svgWidth} 0 L ${svgWidth} 200 Q ${svgWidth-200} 200 ${svgWidth-200} 0 Z" fill="${emerald800}"/>
    <path d="M ${svgWidth-192} 8 L ${svgWidth-8} 8 L ${svgWidth-8} 192 Q ${svgWidth-192} 192 ${svgWidth-192} 8 Z" fill="${yellow400}" opacity="0.8"/>
    <path d="M ${svgWidth-184} 16 L ${svgWidth-16} 16 L ${svgWidth-16} 184 Q ${svgWidth-184} 184 ${svgWidth-184} 16 Z" fill="${emerald800}"/>
  </g>

  <!-- Bottom Left Corner Design -->
  <g>
    <path d="M 0 ${svgHeight-140} Q 140 ${svgHeight-140} 140 ${svgHeight} L 0 ${svgHeight} Z" fill="${yellow400}" opacity="0.8"/>
  </g>

  <!-- Logo/Seal -->
  <g transform="translate(60, 50)">
    <circle cx="32" cy="32" r="32" fill="${yellow400}"/>
    <circle cx="32" cy="32" r="24" fill="${emerald800}"/>
    <circle cx="40" cy="24" r="3" fill="white"/>
    <rect x="28" y="52" width="8" height="20" fill="${emerald800}" rx="4"/>
    <circle cx="32" cy="32" r="16" fill="none" stroke="${yellow400}" stroke-width="1" opacity="0.6"/>
  </g>

  <!-- CERTIFICATE Title -->
  <text x="140" y="85" font-family="serif" font-size="48" font-weight="bold" fill="${emerald800}">CERTIFICATE</text>
  <text x="140" y="115" font-family="serif" font-size="24" fill="${emerald800}">OF APPRECIATION</text>

  <!-- Main Content Text -->
  <text x="${svgWidth / 2}" y="190" font-family="serif" font-size="20" fill="${gray700}" text-anchor="middle">This certificate is proudly presented to:</text>
  
  <!-- Recipient Name -->
  <text x="${svgWidth / 2}" y="250" font-family="serif" font-size="42" font-weight="bold" fill="${emerald800}" text-anchor="middle">${name}</text>
  
  <!-- Underline for name -->
  <rect x="${svgWidth / 2 - 150}" y="265" width="300" height="3" fill="${yellow400}" rx="1.5"/>

  <!-- Description Text - Multiple Lines -->
  <text x="${svgWidth / 2}" y="310" font-family="serif" font-size="18" fill="${gray600}" text-anchor="middle">In recognition of your outstanding achievements and unwavering</text>
  <text x="${svgWidth / 2}" y="335" font-family="serif" font-size="18" fill="${gray600}" text-anchor="middle">dedication. Your exceptional performance and commitment have</text>
  <text x="${svgWidth / 2}" y="360" font-family="serif" font-size="18" fill="${gray600}" text-anchor="middle">significantly contributed to our success, and we honor your</text>
  <text x="${svgWidth / 2}" y="385" font-family="serif" font-size="18" fill="${gray600}" text-anchor="middle">contributions with this award.</text>

  <!-- Date Section -->
  <text x="${svgWidth / 2}" y="450" font-family="serif" font-size="18" fill="${gray700}" text-anchor="middle">Awarded on</text>
  <text x="${svgWidth / 2}" y="480" font-family="serif" font-size="20" font-weight="bold" fill="${emerald800}" text-anchor="middle">${date}</text>
  <rect x="${svgWidth / 2 - 80}" y="490" width="160" height="2" fill="${yellow400}" rx="1"/>

  <!-- Signature Section -->
  <text x="${svgWidth / 2}" y="550" font-family="serif" font-size="30" font-weight="bold" fill="${emerald800}" text-anchor="middle">Mrityunjaya Prajapati</text>
  <rect x="${svgWidth / 2 - 100}" y="560" width="200" height="1" fill="${gray400}"/>
  <text x="${svgWidth / 2}" y="580" font-family="serif" font-size="16" fill="${gray600}" text-anchor="middle">CTO &amp; CEO</text>

  <!-- Footer -->
  <text x="40" y="${svgHeight - 30}" font-family="serif" font-size="14" fill="${gray600}">ID: ${hash}</text>
  <text x="${svgWidth - 40}" y="${svgHeight - 30}" font-family="serif" font-size="16" font-weight="bold" fill="#222" text-anchor="end">KALP STUDIO</text>

  <!-- Logo at bottom right -->
  <image x="${svgWidth - 120}" y="${svgHeight - 80}" width="80" height="20" xlink:href="data:image/svg+xml;base64,${logoSvgBase64}" />
</svg>`;
};

export async function convertCertificateToSvg(certificateData: CertificateData): Promise<string> {
  return generateCertificateSvg(certificateData);
} 