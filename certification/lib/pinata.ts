import { Buffer } from 'buffer';

// Initialize Pinata credentials
const projectId = process.env.NEXT_PUBLIC_PINATA_API_KEY;
const projectSecret = process.env.NEXT_PUBLIC_PINATA_SECRET_KEY;

export interface IPFSUploadResponse {
  path: string;
  cid: string;
  size: number;
  ipfsUrl: string;
}

export async function uploadToPinata(content: string, fileName: string): Promise<string> {
  try {
    console.log('Starting Pinata upload process...');
    console.log('File name:', fileName);
    console.log('Content length:', content.length);

    if (!projectId || !projectSecret) {
      throw new Error('Missing Pinata credentials. Please check your environment variables.');
    }

    // Convert content to Blob
    const blob = new Blob([content], { type: 'text/html' });
    const formData = new FormData();
    formData.append('file', blob, fileName);

    // Upload to Pinata
    console.log('Uploading to Pinata...');
    const response = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
      method: 'POST',
      headers: {
        'pinata_api_key': projectId,
        'pinata_secret_api_key': projectSecret,
      },
      body: formData,
    });

    const responseData = await response.json();
    console.log('Pinata response:', responseData);

    if (!response.ok) {
      if (responseData.error?.reason === 'NO_SCOPES_FOUND') {
        throw new Error('Pinata API key does not have the required permissions. Please check your API key settings in Pinata dashboard.');
      }
      throw new Error(`Failed to upload to Pinata: ${responseData.error?.details || responseData.error?.reason || 'Unknown error'}`);
    }

    return responseData.IpfsHash;
  } catch (error) {
    console.error('Detailed error in Pinata upload:', error);
    throw new Error(`Failed to upload to Pinata: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export function generateCertificateHTML(
  name: string,
  organization: string,
  dateOfIssue: string,
  tokenId: string
): string {
  console.log('Generating certificate HTML for:', { name, organization, dateOfIssue, tokenId });
  
  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Certificate of Appreciation</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700&family=Pacifico&display=swap');
          body {
            background: #f5f5f5;
            margin: 0;
            padding: 0;
          }
          .certificate-container {
            position: relative;
            max-width: 900px;
            margin: 40px auto;
            background: #fff;
            box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.1);
            border-radius: 16px;
            padding: 64px 48px 120px 48px;
            font-family: 'Montserrat', Arial, sans-serif;
            overflow: hidden;
          }
          /* Top right corner design */
          .corner-top {
            position: absolute;
            top: 0; right: 0;
            width: 200px; height: 200px;
            z-index: 1;
          }
          .corner-top .emerald1 {
            position: absolute; top: 0; right: 0;
            width: 100%; height: 100%;
            background: #065f46;
            border-bottom-left-radius: 100%;
          }
          .corner-top .yellow {
            position: absolute; top: 8px; right: 8px;
            width: 100%; height: 100%;
            background: #facc15;
            border-bottom-left-radius: 100%;
            opacity: 0.8;
          }
          .corner-top .emerald2 {
            position: absolute; top: 16px; right: 16px;
            width: 100%; height: 100%;
            background: #065f46;
            border-bottom-left-radius: 100%;
          }
          /* Bottom left corner design */
          .corner-bottom {
            position: absolute;
            bottom: 0; left: 0;
            width: 140px; height: 140px;
            z-index: 1;
          }
          .corner-bottom .yellow {
            position: absolute; bottom: 0; left: 0;
            width: 100%; height: 100%;
            background: #facc15;
            border-top-right-radius: 100%;
            opacity: 0.8;
            transform: scaleX(-1);
          }
          /* Header with seal */
          .header {
            display: flex;
            align-items: center;
            gap: 32px;
            margin-bottom: 32px;
            z-index: 2;
            position: relative;
          }
          .seal {
            width: 64px; height: 64px; position: relative;
          }
          .seal .yellow {
            position: absolute; inset: 0;
            background: #facc15;
            border-radius: 50%;
          }
          .seal .emerald {
            position: absolute; top: 8px; left: 8px; right: 8px; bottom: 8px;
            background: #065f46;
            border-radius: 50%;
          }
          .seal .dot {
            position: absolute; top: 12px; right: 12px;
            width: 8px; height: 8px;
            background: #fff;
            border-radius: 50%;
          }
          .seal .stem {
            position: absolute; bottom: 0; left: 50%;
            transform: translateX(-50%);
            width: 16px; height: 32px;
            background: #065f46;
            border-radius: 8px;
          }
          .header-title h1 {
            font-size: 3rem;
            font-family: 'Montserrat', serif;
            color: #065f46;
            margin: 0;
            font-weight: 700;
            letter-spacing: 2px;
          }
          .header-title p {
            font-size: 1.5rem;
            color: #065f46;
            margin: 0;
            font-weight: 400;
            letter-spacing: 1px;
          }
          .main-content {
            text-align: center;
            margin-top: 32px;
            margin-bottom: 32px;
            z-index: 2;
            position: relative;
          }
          .main-content .presented {
            color: #374151;
            font-size: 1.25rem;
            margin-bottom: 24px;
          }
          .main-content .recipient {
            font-size: 2.5rem;
            font-family: 'Pacifico', cursive;
            color: #065f46;
            margin: 16px 0 8px 0;
            font-weight: 400;
          }
          .main-content .divider {
            width: 66%; height: 2px;
            background: #facc15;
            margin: 0 auto 24px auto;
          }
          .main-content .description {
            color: #4b5563;
            font-size: 1.1rem;
            max-width: 600px;
            margin: 0 auto 32px auto;
            line-height: 1.7;
          }
          .main-content .date-section {
            margin-top: 24px;
          }
          .main-content .date-label {
            color: #374151;
            font-size: 1rem;
          }
          .main-content .date-value {
            color: #065f46;
            font-weight: 500;
            font-size: 1.2rem;
            margin-top: 4px;
          }
          .main-content .date-divider {
            width: 200px; height: 2px;
            background: #facc15;
            margin: 12px auto 0 auto;
          }
          .signature-section {
            margin-top: 48px;
            margin-bottom: 32px;
            text-align: center;
          }
          .signature {
            font-family: 'Pacifico', cursive;
            font-size: 2rem;
            color: #065f46;
            margin-bottom: 4px;
          }
          .signature-line {
            width: 180px; height: 2px;
            background: #d1d5db;
            margin: 0 auto 4px auto;
          }
          .signature-role {
            color: #6b7280;
            font-size: 1rem;
          }
          .footer {
            position: absolute;
            bottom: 32px; left: 48px; right: 48px;
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
            z-index: 2;
          }
          .footer .id {
            color: #6b7280;
            font-size: 0.95rem;
          }
          .footer .logo {
            height: 48px; width: 90px;
          }
        </style>
    </head>
    <body>
      <div class="certificate-container">
        <!-- Top right corner design -->
        <div class="corner-top">
          <div class="emerald1"></div>
          <div class="yellow"></div>
          <div class="emerald2"></div>
        </div>
        <!-- Bottom left corner design -->
        <div class="corner-bottom">
          <div class="yellow"></div>
        </div>
        <!-- Header with seal -->
        <div class="header">
          <div class="seal">
            <div class="yellow"></div>
            <div class="emerald"></div>
            <div class="dot"></div>
            <div class="stem"></div>
          </div>
          <div class="header-title">
            <h1>CERTIFICATE</h1>
            <p>OF APPRECIATION</p>
          </div>
        </div>
        <!-- Main Content -->
        <div class="main-content">
          <div class="presented">This certificate is proudly presented to:</div>
          <div class="recipient">${name}</div>
          <div class="divider"></div>
          <div class="description">
            In recognition of your outstanding achievements and unwavering dedication. Your exceptional performance and commitment have significantly contributed to our success, and we honor your contributions with this award.
          </div>
          <div class="date-section">
            <div class="date-label">Awarded on</div>
            <div class="date-value">${dateOfIssue}</div>
            <div class="date-divider"></div>
          </div>
        </div>
        <!-- Signature Section -->
        <div class="signature-section">
          <div class="signature">Mrityunjaya Prajapati</div>
          <div class="signature-line"></div>
          <div class="signature-role">CTO & CEO</div>
        </div>
        <!-- Footer Section with ID and Logo -->
        <div class="footer">
          <div class="id">ID: ${tokenId}</div>
          <div class="logo">
            <img src="https://kalpstudio.com/KalpStudio.svg" alt="Certificate Logo" style="height:100%;width:100%;object-fit:contain;" />
          </div>
        </div>
      </div>
    </body>
    </html>
  `;

  console.log('HTML template generated');
  return html;
} 