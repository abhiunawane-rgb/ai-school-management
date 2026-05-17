import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

class HomeScreen extends StatelessWidget {
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final items = [
      ('Attendance', Icons.fact_check, null),
      ('Homework', Icons.assignment, null),
      ('Social Feed', Icons.feed, null),
      ('Bus Tracking', Icons.directions_bus, '/bus-tracking'),
      ('AI Assistant', Icons.smart_toy, '/ai-chat'),
      ('Online Classes', Icons.video_call, null),
    ];

    return Scaffold(
      appBar: AppBar(title: const Text('Home')),
      body: GridView.builder(
        padding: const EdgeInsets.all(16),
        gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
          crossAxisCount: 2,
          crossAxisSpacing: 12,
          mainAxisSpacing: 12,
          childAspectRatio: 1.1,
        ),
        itemCount: items.length,
        itemBuilder: (context, i) {
          final (label, icon, route) = items[i];
          return Card(
            child: InkWell(
              onTap: route != null ? () => context.push(route) : null,
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Icon(icon, size: 40, color: Theme.of(context).colorScheme.primary),
                  const SizedBox(height: 8),
                  Text(label, textAlign: TextAlign.center),
                ],
              ),
            ),
          );
        },
      ),
    );
  }
}
