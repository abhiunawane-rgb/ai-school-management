import * as functions from 'firebase-functions/v1';
import * as admin from 'firebase-admin';

export const onAttendanceMarked = functions.firestore
  .document('attendance/{recordId}')
  .onCreate(async (snap) => {
    const data = snap.data();
    const student = await admin.firestore().collection('students').doc(data.studentId).get();
    const parentIds: string[] = student.data()?.parentIds ?? [];

    const batch = admin.firestore().batch();
    for (const parentId of parentIds) {
      const notifRef = admin.firestore().collection('notifications').doc();
      batch.set(notifRef, {
        userId: parentId,
        tenantId: data.tenantId,
        type: 'attendance',
        title: 'Attendance Updated',
        body: `Attendance marked as ${data.status} for today`,
        read: false,
        createdAt: new Date().toISOString(),
      });
    }
    await batch.commit();
  });
