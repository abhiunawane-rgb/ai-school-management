import 'package:flutter/material.dart';

import '../../../core/demo/academic_demo_data.dart';

class HomeworkScreen extends StatelessWidget {
  const HomeworkScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final items = AcademicDemoData.homeworkForStudent();
    return Scaffold(
      appBar: AppBar(title: const Text('Homework')),
      body: ListView.separated(
        padding: const EdgeInsets.all(16),
        itemCount: items.length,
        separatorBuilder: (_, __) => const SizedBox(height: 12),
        itemBuilder: (context, i) {
          final hw = items[i];
          return Card(
            child: Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(hw.title, style: const TextStyle(fontWeight: FontWeight.w600, fontSize: 16)),
                  const SizedBox(height: 6),
                  Text('${hw.subject} · Due ${hw.dueDate}', style: TextStyle(color: Colors.grey.shade600, fontSize: 13)),
                  const SizedBox(height: 8),
                  Text(hw.description),
                ],
              ),
            ),
          );
        },
      ),
    );
  }
}
