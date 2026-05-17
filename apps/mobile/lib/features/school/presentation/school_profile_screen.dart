import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../core/auth/auth_state_provider.dart';
import '../../../core/demo/demo_store.dart';
import '../../../widgets/school_header.dart';

class SchoolProfileScreen extends ConsumerWidget {
  const SchoolProfileScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final user = ref.watch(currentUserProvider)!;
    final school = user.school;

    return Scaffold(
      appBar: AppBar(title: const Text('School profile')),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          Card(
            child: Padding(
              padding: const EdgeInsets.all(16),
              child: SchoolHeader(school: school, subtitle: user.role.label),
            ),
          ),
          const SizedBox(height: 16),
          _InfoTile(label: 'Principal', value: school.principalName),
          _InfoTile(label: 'Address', value: school.address),
          _InfoTile(label: 'City', value: school.city),
          _InfoTile(label: 'Board', value: school.board),
          _InfoTile(label: 'Phone', value: school.phone),
          _InfoTile(label: 'Email', value: school.email),
          const SizedBox(height: 16),
          Text(
            'To edit school name and logo, use the web admin dashboard (http://localhost:3001) during local testing.',
            style: Theme.of(context).textTheme.bodySmall?.copyWith(
                  color: Colors.grey.shade600,
                ),
          ),
        ],
      ),
    );
  }
}

class _InfoTile extends StatelessWidget {
  const _InfoTile({required this.label, required this.value});

  final String label;
  final String value;

  @override
  Widget build(BuildContext context) {
    if (value.isEmpty) return const SizedBox.shrink();
    return ListTile(
      title: Text(label, style: const TextStyle(fontSize: 12, color: Colors.grey)),
      subtitle: Text(value, style: const TextStyle(fontSize: 16)),
    );
  }
}
