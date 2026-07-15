import 'package:flutter/material.dart';

import '../../../core/notifications/app_notifications.dart';

class EmergencyScreen extends StatelessWidget {
  const EmergencyScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Emergency')),
      body: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            Card(
              color: Colors.red.shade50,
              child: const Padding(
                padding: EdgeInsets.all(16),
                child: Text(
                  'Use only for genuine emergencies. School transport desk and admin are notified immediately.',
                  style: TextStyle(color: Colors.red),
                ),
              ),
            ),
            const SizedBox(height: 16),
            FilledButton.icon(
              onPressed: () {
                AppNotifications.warning(
                  context,
                  'Alert sent',
                  'School admin and transport desk were notified (demo).',
                  solution: 'Connect Firebase for live emergency alerts.',
                );
              },
              icon: const Icon(Icons.warning_amber),
              label: const Text('Send emergency alert'),
              style: FilledButton.styleFrom(backgroundColor: Colors.red.shade700),
            ),
            const SizedBox(height: 12),
            OutlinedButton.icon(
              onPressed: () {},
              icon: const Icon(Icons.phone),
              label: const Text('Call transport desk: +91 98765 43210'),
            ),
          ],
        ),
      ),
    );
  }
}
