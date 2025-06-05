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

export async function uploadToIPFS(content: string, fileName: string): Promise<IPFSUploadResponse> {
  try {
    console.log('Starting IPFS upload process...');
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

    const ipfsUrl = `https://gateway.pinata.cloud/ipfs/${responseData.IpfsHash}`;
    console.log('Generated IPFS URL:', ipfsUrl);

    return {
      path: fileName,
      cid: responseData.IpfsHash,
      size: responseData.PinSize,
      ipfsUrl,
    };
  } catch (error) {
    console.error('Detailed error in IPFS upload:', error);
    throw new Error(`Failed to upload to IPFS: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export async function generateCertificateHTML(
  name: string,
  certificateId: string,
  issueDate: string,
  additionalData?: Record<string, string>
): Promise<string> {
  console.log('Generating certificate HTML for:', { name, certificateId, issueDate });
  
  // You can customize this HTML template according to your needs
  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Certificate of Achievement</title>
        <style>
            body {
                font-family: 'Arial', sans-serif;
                margin: 0;
                padding: 40px;
                background-color: #f5f5f5;
            }
            .certificate {
                max-width: 800px;
                margin: 0 auto;
                background-color: white;
                padding: 40px;
                border: 2px solid #gold;
                box-shadow: 0 0 10px rgba(0,0,0,0.1);
            }
            .header {
                text-align: center;
                margin-bottom: 40px;
            }
            .content {
                text-align: center;
                margin-bottom: 40px;
            }
            .footer {
                text-align: center;
                margin-top: 40px;
                font-size: 0.9em;
                color: #666;
            }
        </style>
    </head>
    <body>
        <div class="certificate">
            <div class="header">
                <h1>Certificate of Achievement</h1>
            </div>
            <div class="content">
                <p>This is to certify that</p>
                <h2>${name}</h2>
                <p>has successfully completed the certification program.</p>
                ${additionalData ? Object.entries(additionalData).map(([key, value]) => 
                    `<p><strong>${key}:</strong> ${value}</p>`
                ).join('') : ''}
            </div>
            <div class="footer">
                <p>Certificate ID: ${certificateId}</p>
                <p>Issued on: ${issueDate}</p>
            </div>
        </div>
    </body>
    </html>
  `;

  console.log('HTML template generated');
  return html;
} 