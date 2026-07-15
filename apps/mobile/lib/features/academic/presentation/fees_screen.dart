import 'package:flutter/material.dart';

import '../../../core/demo/academic_demo_data.dart';
import '../../../core/notifications/app_notifications.dart';

class FeesScreen extends StatelessWidget {
  const FeesScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final fee = AcademicDemoData.parentFees();
    return Scaffold(
      appBar: AppBar(title: const Text('Fees & pay')),
      body: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            Card(
              child: Padding(
                padding: const EdgeInsets.all(20),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(fee.studentName, style: const TextStyle(fontSize: 18, fontWeight: FontWeight.w600)),
                    const SizedBox(height: 16),
                    _Row(label: 'Total fees', value: '₹${fee.total}'),
                    _Row(label: 'Paid', value: '₹${fee.paid}', color: Colors.green.shade700),
                    _Row(label: 'Pending', value: '₹${fee.pending}', color: Colors.orange.shade800),
                    const SizedBox(height: 12),
                    Chip(label: Text(fee.status.toUpperCase())),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 16),
            FilledButton(
              onPressed: () {
                AppNotifications.info(
                  context,
                  'Payment unavailable',
                  'Online payment opens when Razorpay/Stripe is connected.',
                  solution: 'Pay at the school office or contact admin for UPI details.',
                );
              },
              child: const Text('Pay pending balance'),
            ),
            const SizedBox(height: 8),
            Text(
              'Fee details sync from the school admin dashboard. Contact the school office for cash/UPI at counter.',
              style: TextStyle(fontSize: 12, color: Colors.grey.shade600),
            ),
          ],
        ),
      ),
    );
  }
}

class _Row extends StatelessWidget {
  const _Row({required this.label, required this.value, this.color});

  final String label;
  final String value;
  final Color? color;

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 4),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(label, style: TextStyle(color: Colors.grey.shade600)),
          Text(value, style: TextStyle(fontWeight: FontWeight.w600, color: color)),
        ],
      ),
    );
  }
}
