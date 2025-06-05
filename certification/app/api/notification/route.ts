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
    const notificationData: NotificationRequest = await request.json();

    if (!notificationData.eventName || !notificationData.emailContent || !notificationData.receiverIds) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      );
    }

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apiKey': API_KEY,
        'sender': SENDER,
      },
      body: JSON.stringify(notificationData),
    });
    console.log(response);
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to send notification');
    }
     
    const data = await response.json();
    return NextResponse.json(data);

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