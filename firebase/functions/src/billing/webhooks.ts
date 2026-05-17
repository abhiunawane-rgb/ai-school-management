import * as functions from 'firebase-functions/v1';
import * as admin from 'firebase-admin';
import Stripe from 'stripe';

export const stripeWebhook = functions.https.onRequest(async (req, res) => {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
  const sig = req.headers['stripe-signature'] as string;

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(req.rawBody, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err) {
    res.status(400).send('Webhook signature verification failed');
    return;
  }

  await admin.firestore().collection('webhook_events').add({
    provider: 'stripe',
    type: event.type,
    payload: event,
    processed: false,
    receivedAt: new Date().toISOString(),
  });

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    const tenantId = session.metadata?.tenantId;
    if (tenantId) {
      await admin
        .firestore()
        .collection('subscriptions')
        .doc(tenantId)
        .set(
          { status: 'active', providerSubscriptionId: session.subscription, updatedAt: new Date().toISOString() },
          { merge: true }
        );
    }
  }

  res.json({ received: true });
});

export const razorpayWebhook = functions.https.onRequest(async (req, res) => {
  await admin.firestore().collection('webhook_events').add({
    provider: 'razorpay',
    type: req.body?.event ?? 'unknown',
    payload: req.body,
    processed: false,
    receivedAt: new Date().toISOString(),
  });

  if (req.body?.event === 'subscription.activated') {
    const tenantId = req.body?.payload?.subscription?.entity?.notes?.tenantId;
    if (tenantId) {
      await admin
        .firestore()
        .collection('subscriptions')
        .doc(tenantId)
        .set({ status: 'active', updatedAt: new Date().toISOString() }, { merge: true });
    }
  }

  res.json({ received: true });
});
