import { NextRequest, NextResponse } from 'next/server';

interface ReceiverInfo {
  userId: string;
  email: string;
}

interface EmailContent {
  name: string;
  transactionHash: string;
  view_link: string;
}

interface NotificationRequest {
  eventName: string;
  emailContent: EmailContent;
  receiverIds: ReceiverInfo[];
}

const API_URL = process.env.NEXT_PUBLIC_NOTIFICATION_API_URL!;
const API_KEY = process.env.NEXT_PUBLIC_NOTIFICATION_API_KEY!
const SENDER = 'demo_dapp';

export async function POST(request: NextRequest) {
  try {
    // Debug: Log environment variables (without exposing sensitive data)
    console.log('API_URL:', API_URL);
    console.log('API_KEY exists:', !!API_KEY);
    console.log('SENDER:', SENDER);

    const notificationData: NotificationRequest = await request.json();

    if (!notificationData.eventName || !notificationData.emailContent || !notificationData.receiverIds) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Debug: Log the request data
    console.log('Sending notification request:', JSON.stringify(notificationData, null, 2));

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apiKey': API_KEY,
        'sender': SENDER,
      },
      body: JSON.stringify(notificationData),
    });

    // Debug: Log response details
    console.log('Response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      // Get response text first to check if it's JSON or HTML
      const responseText = await response.text();
      console.log('Error response body:', responseText);

      let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
      
      try {
        // Try to parse as JSON if possible
        const errorData = JSON.parse(responseText);
        errorMessage = errorData.message || errorMessage;
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (_parseError) {
        // If it's not JSON (like HTML error page), use the status info
        console.log('Response is not JSON, likely HTML error page');
        errorMessage = `Server returned HTML instead of JSON. Status: ${response.status}`;
      }

      throw new Error(errorMessage);
    }
     
    // Get response text and try to parse as JSON
    const responseText = await response.text();
    console.log('Success response body:', responseText);

    try {
      const data = JSON.parse(responseText);
      return NextResponse.json(data);
    } catch (parseError) {
      console.error('Failed to parse success response as JSON:', parseError);
      return NextResponse.json({ 
        message: 'Notification sent but response format was unexpected',
        rawResponse: responseText 
      });
    }

  } catch (error) {
    console.error('Notification error:', error);
    return NextResponse.json(
      { 
        message: 'Failed to send notification',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}