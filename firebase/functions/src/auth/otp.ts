import * as functions from 'firebase-functions/v1';
import * as admin from 'firebase-admin';
import Twilio from 'twilio';
import { z } from 'zod';

const sendOtpSchema = z.object({
  phone: z.string().min(10).max(15),
  countryCode: z.string().length(2),
});

const verifyOtpSchema = z.object({
  phone: z.string().min(10).max(15),
  countryCode: z.string().length(2),
  code: z.string().length(6),
});

function getTwilioClient() {
  return Twilio(
    process.env.TWILIO_ACCOUNT_SID!,
    process.env.TWILIO_AUTH_TOKEN!
  );
}

/** OTP-only authentication — no email/password */
export const sendOtp = functions.https.onCall(async (data, context) => {
  const parsed = sendOtpSchema.safeParse(data);
  if (!parsed.success) {
    throw new functions.https.HttpsError('invalid-argument', 'Invalid phone number');
  }

  const { phone, countryCode } = parsed.data;
  const fullPhone = `+${countryCode === 'IN' ? '91' : ''}${phone.replace(/\D/g, '')}`;

  const client = getTwilioClient();
  const verification = await client.verify.v2
    .services(process.env.TWILIO_VERIFY_SERVICE_SID!)
    .verifications.create({ to: fullPhone, channel: 'sms' });

  await admin.firestore().collection('otp_sessions').doc(verification.sid).set({
    phone: fullPhone,
    countryCode,
    verificationSid: verification.sid,
    expiresAt: new Date(Date.now() + 10 * 60 * 1000).toISOString(),
    attempts: 0,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  });

  return { success: true, sid: verification.sid };
});

export const verifyOtp = functions.https.onCall(async (data, context) => {
  const parsed = verifyOtpSchema.safeParse(data);
  if (!parsed.success) {
    throw new functions.https.HttpsError('invalid-argument', 'Invalid verification data');
  }

  const { phone, countryCode, code } = parsed.data;
  const fullPhone = `+${countryCode === 'IN' ? '91' : ''}${phone.replace(/\D/g, '')}`;

  const client = getTwilioClient();
  const check = await client.verify.v2
    .services(process.env.TWILIO_VERIFY_SERVICE_SID!)
    .verificationChecks.create({ to: fullPhone, code });

  if (check.status !== 'approved') {
    throw new functions.https.HttpsError('permission-denied', 'Invalid OTP');
  }

  let userRecord;
  try {
    userRecord = await admin.auth().getUserByPhoneNumber(fullPhone);
  } catch {
    userRecord = await admin.auth().createUser({ phoneNumber: fullPhone });
  }

  const customToken = await admin.auth().createCustomToken(userRecord.uid);

  const userRef = admin.firestore().collection('users').doc(userRecord.uid);
  const userSnap = await userRef.get();
  if (!userSnap.exists) {
    await userRef.set({
      id: userRecord.uid,
      phone: fullPhone,
      phoneVerified: true,
      displayName: '',
      preferredLanguage: 'en',
      countryCode,
      fcmTokens: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  } else {
    await userRef.update({
      phoneVerified: true,
      updatedAt: new Date().toISOString(),
    });
  }

  return { token: customToken, uid: userRecord.uid };
});
