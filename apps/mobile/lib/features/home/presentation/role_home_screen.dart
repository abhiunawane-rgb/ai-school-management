import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../../core/auth/auth_state_provider.dart';
import '../../../core/demo/demo_store.dart';
import '../../../core/models/user_role.dart';
import '../../../widgets/school_header.dart';

class RoleHomeScreen extends ConsumerWidget {
  const RoleHomeScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final user = ref.watch(currentUserProvider)!;

    return Scaffold(
      appBar: AppBar(
        title: Text('${user.role.label}'),
        actions: [
          IconButton(
            icon: const Icon(Icons.school_outlined),
            onPressed: () => context.push('/school-profile'),
          ),
          IconButton(
            icon: const Icon(Icons.logout),
            onPressed: () async {
              await DemoStore.clearSession();
              ref.read(demoSessionProvider.notifier).state = null;
            },
          ),
        ],
      ),
      body: Column(
        children: [
          Padding(
            padding: const EdgeInsets.fromLTRB(16, 8, 16, 16),
            child: SchoolHeader(
              school: user.school,
              subtitle: '${user.displayName} · ${user.phone}',
            ),
          ),
          Expanded(child: _RoleBody(role: user.role)),
        ],
      ),
    );
  }
}

class _RoleBody extends StatelessWidget {
  const _RoleBody({required this.role});

  final UserRole role;

  @override
  Widget build(BuildContext context) {
    final items = _itemsForRole(role);
    return GridView.builder(
      padding: const EdgeInsets.all(16),
      gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
        crossAxisCount: 2,
        crossAxisSpacing: 12,
        mainAxisSpacing: 12,
        childAspectRatio: 1.05,
      ),
      itemCount: items.length,
      itemBuilder: (context, i) {
        final item = items[i];
        return Card(
          elevation: 0,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(16),
            side: BorderSide(color: Colors.grey.shade200),
          ),
          child: InkWell(
            borderRadius: BorderRadius.circular(16),
            onTap: item.route != null ? () => context.push(item.route!) : null,
            child: Padding(
              padding: const EdgeInsets.all(12),
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Icon(item.icon, size: 36, color: Theme.of(context).colorScheme.primary),
                  const SizedBox(height: 10),
                  Text(
                    item.label,
                    textAlign: TextAlign.center,
                    style: const TextStyle(fontWeight: FontWeight.w600, fontSize: 13),
                  ),
                  if (item.hint != null) ...[
                    const SizedBox(height: 4),
                    Text(
                      item.hint!,
                      textAlign: TextAlign.center,
                      style: TextStyle(fontSize: 10, color: Colors.grey.shade600),
                    ),
                  ],
                ],
              ),
            ),
          ),
        );
      },
    );
  }

  List<_HomeItem> _itemsForRole(UserRole role) {
    switch (role) {
      case UserRole.schoolAdmin:
      case UserRole.subAdmin:
        return [
          _HomeItem('School profile', Icons.school, '/school-profile'),
          _HomeItem('Holiday calendar', Icons.calendar_month, '/holidays'),
          _HomeItem('Attendance', Icons.fact_check, '/attendance', hint: 'School overview'),
          _HomeItem('Leave requests', Icons.beach_access, '/leaves'),
          _HomeItem('Team invites', Icons.group_add, null, hint: 'Web admin portal'),
          _HomeItem('Subscription', Icons.payments, null, hint: 'Web admin portal'),
        ];
      case UserRole.teacher:
        return [
          _HomeItem('Attendance', Icons.fact_check, '/attendance', hint: 'My record & mark class'),
          _HomeItem('Apply leave', Icons.beach_access, '/leaves'),
          _HomeItem('Holiday calendar', Icons.calendar_month, '/holidays'),
          _HomeItem('Homework', Icons.assignment, '/homework'),
          _HomeItem('Notices', Icons.campaign, '/notices'),
          _HomeItem('AI assistant', Icons.smart_toy, '/ai-chat'),
        ];
      case UserRole.parent:
        return [
          _HomeItem('Child attendance', Icons.fact_check, '/attendance'),
          _HomeItem('Child leave', Icons.beach_access, '/leaves'),
          _HomeItem('Holiday calendar', Icons.calendar_month, '/holidays'),
          _HomeItem('Fees & pay', Icons.payments, '/fees'),
          _HomeItem('Bus tracking', Icons.directions_bus, '/bus-tracking'),
          _HomeItem('AI assistant', Icons.smart_toy, '/ai-chat'),
        ];
      case UserRole.student:
        return [
          _HomeItem('My attendance', Icons.fact_check, '/attendance'),
          _HomeItem('Apply leave', Icons.beach_access, '/leaves'),
          _HomeItem('Holiday calendar', Icons.calendar_month, '/holidays'),
          _HomeItem('Timetable', Icons.schedule, '/timetable'),
          _HomeItem('Homework', Icons.assignment, '/homework'),
          _HomeItem('AI assistant', Icons.smart_toy, '/ai-chat'),
        ];
      case UserRole.driver:
        return [
          _HomeItem('Duty attendance', Icons.fact_check, '/attendance'),
          _HomeItem('Apply leave', Icons.beach_access, '/leaves'),
          _HomeItem('Holiday calendar', Icons.calendar_month, '/holidays'),
          _HomeItem('Update bus GPS', Icons.gps_fixed, '/bus-tracking', hint: 'Live location'),
          _HomeItem('My route', Icons.route, '/driver-route'),
          _HomeItem('Emergency', Icons.warning_amber, '/emergency'),
        ];
    }
  }
}

class _HomeItem {
  _HomeItem(this.label, this.icon, this.route, {this.hint});
  final String label;
  final IconData icon;
  final String? route;
  final String? hint;
}
