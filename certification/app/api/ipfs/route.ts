import { NextResponse } from 'next/server';
import { uploadToIPFS, generateCertificateHTML } from '@/lib/ipfs';

export async function POST(request: Request) {
  console.log('API endpoint called');
  
  try {
    // Validate request body
    let body;
    try {
      body = await request.json();
      console.log('Received request body:', body);
    } catch (e) {
      console.error('Failed to parse request body:', e);
      return NextResponse.json(
        { 
          success: false,
          error: 'Invalid request body',
          details: e instanceof Error ? e.message : 'Unknown error'
        },
        { status: 400 }
      );
    }
    
    const { name, certificateId, issueDate, additionalData } = body;

    if (!name || !certificateId || !issueDate) {
      console.log('Missing required fields:', { name, certificateId, issueDate });
      return NextResponse.json(
        { 
          success: false,
          error: 'Missing required fields',
          details: 'Name, certificateId, and issueDate are required'
        },
        { status: 400 }
      );
    }

    // Check if Pinata credentials are available
    if (!process.env.NEXT_PUBLIC_PINATA_API_KEY || !process.env.NEXT_PUBLIC_PINATA_SECRET_KEY) {
      console.error('Missing Pinata credentials');
      return NextResponse.json(
        { 
          success: false,
          error: 'IPFS service configuration error',
          details: 'Pinata credentials are not configured'
        },
        { status: 500 }
      );
    }

    try {
      console.log('Generating certificate HTML...');
      // Generate the certificate HTML
      const htmlContent = await generateCertificateHTML(
        name,
        certificateId,
        issueDate,
        additionalData
      );
      console.log('HTML content generated successfully');

      console.log('Uploading to IPFS...');
      // Upload to IPFS
      const result = await uploadToIPFS(
        htmlContent,
        `certificate-${certificateId}.html`
      );

      console.log('IPFS Upload Result:', {
        cid: result.cid,
        path: result.path,
        ipfsUrl: result.ipfsUrl,
        size: result.size
      });

      if (!result.cid || !result.ipfsUrl) {
        throw new Error('Invalid IPFS response: Missing CID or URL');
      }

      const response = {
        success: true,
        data: {
          ipfsUrl: result.ipfsUrl,
          cid: result.cid,
          path: result.path,
        },
      };

      console.log('Sending success response:', response);
      return NextResponse.json(response);
    } catch (error) {
      console.error('Error in IPFS process:', error);
      return NextResponse.json(
        { 
          success: false,
          error: 'IPFS process failed',
          details: error instanceof Error ? error.message : 'Unknown error'
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Unexpected error in IPFS API:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 