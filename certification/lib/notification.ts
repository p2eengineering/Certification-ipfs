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

export async function sendNotification(emailContent: EmailContent, receiverInfo: ReceiverInfo) {
    const notificationData: NotificationRequest = {
      eventName: 'SuccessfulMint',
      emailContent,
      receiverIds: [receiverInfo],
    };
  
    const response = await fetch('/api/notification', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(notificationData),
    });
  
    if (!response.ok) {
      throw new Error('Failed to send notification');
    }
  
    return response.json();
  }