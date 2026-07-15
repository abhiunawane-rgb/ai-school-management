import 'package:flutter/material.dart';

class DriverRouteScreen extends StatelessWidget {
  const DriverRouteScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('My route')),
      body: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text('Route A — Koregaon Park', style: TextStyle(fontSize: 18, fontWeight: FontWeight.w600)),
            const SizedBox(height: 8),
            Text('Vehicle MH-12-AB-4521', style: TextStyle(color: Colors.grey.shade600)),
            const SizedBox(height: 24),
            const Text('Stops', style: TextStyle(fontWeight: FontWeight.w600)),
            const SizedBox(height: 8),
            ...['Gate 1 — School', 'Stop 2 — FC Road', 'Stop 3 — Koregaon Park', 'Stop 4 — School return'].map(
              (s) => Card(
                margin: const EdgeInsets.only(bottom: 8),
                child: ListTile(leading: const Icon(Icons.place_outlined), title: Text(s)),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
