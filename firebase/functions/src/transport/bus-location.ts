import * as functions from 'firebase-functions/v1';
import * as admin from 'firebase-admin';

export const updateBusLocation = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'Authentication required');
  }

  const { routeId, tenantId, lat, lng, speed, heading } = data;

  const membershipId = `${context.auth.uid}_${tenantId}`;
  const membership = await admin.firestore().collection('memberships').doc(membershipId).get();

  if (!membership.exists || membership.data()?.role !== 'driver') {
    throw new functions.https.HttpsError('permission-denied', 'Driver role required');
  }

  await admin
    .firestore()
    .collection('bus_locations')
    .doc(routeId)
    .set({
      routeId,
      tenantId,
      lat,
      lng,
      speed: speed ?? null,
      heading: heading ?? null,
      updatedAt: new Date().toISOString(),
    });

  return { success: true };
});
