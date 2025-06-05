import { NextResponse } from 'next/server';

export async function GET() {
  try {
    console.log('Testing Pinata connection...');
    
    // Check Pinata credentials
    const projectId = process.env.NEXT_PUBLIC_PINATA_API_KEY;
    const projectSecret = process.env.NEXT_PUBLIC_PINATA_SECRET_KEY;

    if (!projectId || !projectSecret) {
      console.error('Missing Pinata credentials');
      return NextResponse.json(
        {
          success: false,
          error: 'Missing Pinata credentials',
          details: 'Please check your environment variables'
        },
        { status: 500 }
      );
    }

    // Test the connection with a simple file upload
    try {
      const testContent = 'Test connection';
      const blob = new Blob([testContent], { type: 'text/plain' });
      const formData = new FormData();
      formData.append('file', blob, 'test.txt');

      const response = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
        method: 'POST',
        headers: {
          'pinata_api_key': projectId,
          'pinata_secret_api_key': projectSecret,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to upload test file');
      }

      const result = await response.json();
      console.log('Pinata test successful:', result);
      
      return NextResponse.json({
        success: true,
        message: 'Pinata connection successful',
        testResult: result
      });
    } catch (error) {
      console.error('Pinata API test failed:', error);
      return NextResponse.json(
        {
          success: false,
          error: 'Pinata API test failed',
          details: error instanceof Error ? error.message : 'Unknown error'
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Unexpected error in Pinata test:', error);
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