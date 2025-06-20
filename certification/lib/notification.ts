interface ReceiverInfo {
    userId: string;
    email: string;
}
  
interface EmailContent {
    name: string;
    transactionHash: string;
    view_link: string;
}

export async function sendNotification(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _emailContent: EmailContent, 
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _receiverInfo: ReceiverInfo
) {
    // NOTIFICATION SERVICE TEMPORARILY DISABLED
    // To re-enable: uncomment the code below and ensure environment variables are set
    
    /*
    const notificationData = {
      eventName: 'SuccessfulMint',
      emailContent: _emailContent,
      receiverIds: [_receiverInfo],
    };
  
    console.log('Sending notification request:', notificationData);
  
    try {
      const response = await fetch('/api/notification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(notificationData),
      });
  
      console.log('Response status:', response.status);
      console.log('Response ok:', response.ok);
  
      if (!response.ok) {
        // Get the error details from the server
        const errorText = await response.text();
        console.error('Server error response:', errorText);
        
        try {
          const errorData = JSON.parse(errorText);
          throw new Error(`Notification failed: ${errorData.message || errorData.error || 'Unknown server error'}`);
        } catch (parseError) {
          throw new Error(`Notification failed with status ${response.status}: ${errorText}`);
        }
      }
  
      const result = await response.json();
      console.log('Notification success:', result);
      return result;
    } catch (error) {
      console.error('Notification error details:', error);
      throw error;
    }
    */
}