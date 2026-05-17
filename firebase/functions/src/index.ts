import * as admin from 'firebase-admin';

admin.initializeApp();

export { sendOtp, verifyOtp } from './auth/otp';
export { createCheckoutSession } from './billing/checkout';
export { stripeWebhook, razorpayWebhook } from './billing/webhooks';
export { sendPushNotification } from './notifications/push';
export { sendWhatsAppAlert } from './notifications/whatsapp';
export { onAttendanceMarked } from './triggers/attendance';
export { updateBusLocation } from './transport/bus-location';
export { calculatePrice } from './billing/price-calculator';
