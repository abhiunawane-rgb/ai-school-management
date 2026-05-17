import * as functions from 'firebase-functions/v1';
import * as admin from 'firebase-admin';
import Stripe from 'stripe';
import { getPaymentProviderForCountry } from '@ai-school/shared';

export const createCheckoutSession = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'Authentication required');
  }

  const { tenantId, priceQuote, successUrl, cancelUrl } = data;
  const membershipId = `${context.auth.uid}_${tenantId}`;
  const membership = await admin.firestore().collection('memberships').doc(membershipId).get();

  if (!membership.exists || membership.data()?.role !== 'school_admin') {
    throw new functions.https.HttpsError('permission-denied', 'School admin required');
  }

  const tenant = await admin.firestore().collection('tenants').doc(tenantId).get();
  const countryCode = tenant.data()?.countryCode ?? 'US';
  const provider = getPaymentProviderForCountry(countryCode);

  if (provider === 'stripe') {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      success_url: successUrl,
      cancel_url: cancelUrl,
      line_items: [
        {
          price_data: {
            currency: priceQuote.currency.toLowerCase(),
            product_data: { name: 'AI School Management Subscription' },
            unit_amount: Math.round(priceQuote.totalAmount * 100),
            recurring: { interval: 'month' },
          },
          quantity: 1,
        },
      ],
      metadata: { tenantId },
    });
    return { provider: 'stripe', sessionId: session.id, url: session.url };
  }

  // Razorpay handled client-side with order creation via separate callable
  return { provider: 'razorpay', tenantId, amount: priceQuote.totalAmount, currency: priceQuote.currency };
});
