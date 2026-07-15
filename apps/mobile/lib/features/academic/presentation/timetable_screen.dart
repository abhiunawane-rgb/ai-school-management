import 'package:flutter/material.dart';

import '../../../core/demo/academic_demo_data.dart';

class TimetableScreen extends StatelessWidget {
  const TimetableScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final periods = AcademicDemoData.timetableMonday();
    return Scaffold(
      appBar: AppBar(title: const Text('Timetable')),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          Text('Monday', style: Theme.of(context).textTheme.titleMedium),
          const SizedBox(height: 12),
          ...periods.map(
            (p) => Card(
              margin: const EdgeInsets.only(bottom: 8),
              child: ListTile(
                leading: CircleAvatar(child: Text('${p.period}')),
                title: Text(p.subject, style: const TextStyle(fontWeight: FontWeight.w600)),
                subtitle: Text('${p.teacher} · Room ${p.room}'),
              ),
            ),
          ),
        ],
      ),
    );
  }
}
