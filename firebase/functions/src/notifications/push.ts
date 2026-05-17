import * as functions from 'firebase-functions/v1';
import * as admin from 'firebase-admin';

export const sendPushNotification = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'Authentication required');
  }

  const { userIds, title, body, data: payload, tenantId } = data;

  const tokens: string[] = [];
  for (const userId of userIds as string[]) {
    const user = await admin.firestore().collection('users').doc(userId).get();
    const fcmTokens = user.data()?.fcmTokens ?? [];
    tokens.push(...fcmTokens);
  }

  if (tokens.length === 0) {
    return { success: false, reason: 'no_tokens' };
  }

  const response = await admin.messaging().sendEachForMulticast({
    tokens,
    notification: { title, body },
    data: { ...payload, tenantId },
  });

  return { success: true, successCount: response.successCount, failureCount: response.failureCount };
});
