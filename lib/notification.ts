export interface NotificationContent {
  name: string;
  transactionHash: string;
  view_link: string;
  ipfsUrl: string;
}

export interface ReceiverInfo {
  userId: string;
  email: string;
}

export async function sendNotification(
  content: NotificationContent,
  receiverInfo: ReceiverInfo
) {
  // Implementation
} 