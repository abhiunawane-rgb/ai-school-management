import * as functions from 'firebase-functions/v1';
import * as admin from 'firebase-admin';
import { calculateSubscriptionPrice } from '@ai-school/shared';
import type { FeatureKey } from '@ai-school/shared';

export const calculatePrice = functions.https.onCall(async (data, context) => {
  const { planId, countryCode, studentCount, enabledFeatures, billingInterval } = data;

  const [planSnap, pricingSnap] = await Promise.all([
    admin.firestore().collection('plans').doc(planId).get(),
    admin
      .firestore()
      .collection('country_pricing')
      .where('countryCode', '==', countryCode)
      .limit(1)
      .get(),
  ]);

  if (!planSnap.exists) {
    throw new functions.https.HttpsError('not-found', 'Plan not found');
  }

  const plan = planSnap.data() as Parameters<typeof calculateSubscriptionPrice>[0]['plan'];
  const countryPricing = pricingSnap.docs[0]?.data() as Parameters<
    typeof calculateSubscriptionPrice
  >[0]['countryPricing'];

  if (!countryPricing) {
    throw new functions.https.HttpsError('not-found', 'Country pricing not configured');
  }

  return calculateSubscriptionPrice({
    plan,
    countryPricing,
    studentCount,
    enabledFeatures: enabledFeatures as FeatureKey[],
    billingInterval,
  });
});
