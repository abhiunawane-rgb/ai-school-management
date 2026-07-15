import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:intl/intl.dart';

import '../../../core/auth/auth_state_provider.dart';
import '../../../core/demo/calendar_store.dart';
import '../../../core/demo/school_options.dart';
import '../../../core/notifications/app_notifications.dart';
import '../../../core/models/calendar_models.dart';
import '../../../core/models/user_role.dart';

class LeavesScreen extends ConsumerStatefulWidget {
  const LeavesScreen({super.key});

  @override
  ConsumerState<LeavesScreen> createState() => _LeavesScreenState();
}

class _LeavesScreenState extends ConsumerState<LeavesScreen> {
  List<LeaveRequest> _leaves = [];
  bool _loading = true;

  @override
  void initState() {
    super.initState();
    _reload();
  }

  Future<void> _reload() async {
    final list = await CalendarStore.loadLeaves();
    if (mounted) {
      setState(() {
        _leaves = list;
        _loading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    final role = ref.watch(currentUserProvider)!.role;
    final canApply = role == UserRole.teacher ||
        role == UserRole.student ||
        role == UserRole.driver ||
        role == UserRole.parent;

    return Scaffold(
      appBar: AppBar(title: Text(_title(role))),
      floatingActionButton: canApply
          ? FloatingActionButton.extended(
              onPressed: () => _showApplyDialog(context),
              icon: const Icon(Icons.add),
              label: const Text('Apply leave'),
            )
          : null,
      body: _loading
          ? const Center(child: CircularProgressIndicator())
          : _leaves.isEmpty
              ? Center(
                  child: Text(
                    'No leave requests yet.',
                    style: TextStyle(color: Colors.grey.shade600),
                  ),
                )
              : RefreshIndicator(
                  onRefresh: _reload,
                  child: ListView.builder(
                    padding: const EdgeInsets.all(16),
                    itemCount: _leaves.length,
                    itemBuilder: (context, i) => _LeaveCard(leave: _leaves[i]),
                  ),
                ),
    );
  }

  String _title(UserRole role) {
    switch (role) {
      case UserRole.parent:
        return 'Child leave requests';
      case UserRole.teacher:
        return 'My leaves';
      case UserRole.student:
        return 'My leaves';
      case UserRole.driver:
        return 'Duty leaves';
      default:
        return 'Leave requests';
    }
  }

  Future<void> _showApplyDialog(BuildContext context) async {
    var reason = kLeaveReasons.first;
    var from = DateTime.now().add(const Duration(days: 1));
    var to = from;

    final ok = await showDialog<bool>(
      context: context,
      builder: (ctx) => StatefulBuilder(
        builder: (ctx, setDialog) => AlertDialog(
          title: const Text('Apply for leave'),
          content: SingleChildScrollView(
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                ListTile(
                  contentPadding: EdgeInsets.zero,
                  title: const Text('From'),
                  subtitle: Text(DateFormat.yMMMd().format(from)),
                  trailing: const Icon(Icons.calendar_today, size: 20),
                  onTap: () async {
                    final picked = await showDatePicker(
                      context: ctx,
                      initialDate: from,
                      firstDate: DateTime.now(),
                      lastDate: DateTime.now().add(const Duration(days: 365)),
                    );
                    if (picked != null) setDialog(() => from = picked);
                  },
                ),
                ListTile(
                  contentPadding: EdgeInsets.zero,
                  title: const Text('To'),
                  subtitle: Text(DateFormat.yMMMd().format(to)),
                  trailing: const Icon(Icons.calendar_today, size: 20),
                  onTap: () async {
                    final picked = await showDatePicker(
                      context: ctx,
                      initialDate: to.isBefore(from) ? from : to,
                      firstDate: from,
                      lastDate: DateTime.now().add(const Duration(days: 365)),
                    );
                    if (picked != null) setDialog(() => to = picked);
                  },
                ),
                const SizedBox(height: 8),
                DropdownButtonFormField<String>(
                  value: reason,
                  decoration: const InputDecoration(
                    labelText: 'Reason',
                    border: OutlineInputBorder(),
                  ),
                  items: kLeaveReasons
                      .map((r) => DropdownMenuItem(value: r, child: Text(r)))
                      .toList(),
                  onChanged: (v) {
                    if (v != null) setDialog(() => reason = v);
                  },
                ),
              ],
            ),
          ),
          actions: [
            TextButton(onPressed: () => Navigator.pop(ctx, false), child: const Text('Cancel')),
            FilledButton(onPressed: () => Navigator.pop(ctx, true), child: const Text('Submit')),
          ],
        ),
      ),
    );

    if (ok == true) {
      final end = to.isBefore(from) ? from : to;
      await CalendarStore.addLeave(from: from, to: end, reason: reason);
      await _reload();
      if (context.mounted) {
        AppNotifications.success(
          context,
          'Leave submitted',
          'Your request is pending admin approval.',
          solution: 'You will be notified when it is approved or rejected.',
        );
      }
    }
  }
}

class _LeaveCard extends StatelessWidget {
  const _LeaveCard({required this.leave});

  final LeaveRequest leave;

  @override
  Widget build(BuildContext context) {
    final statusColor = switch (leave.status) {
      LeaveStatus.approved => Colors.green,
      LeaveStatus.rejected => Colors.red,
      LeaveStatus.pending => Colors.orange,
    };

    return Card(
      margin: const EdgeInsets.only(bottom: 10),
      child: ListTile(
        leading: CircleAvatar(
          backgroundColor: statusColor.shade100,
          child: Icon(_statusIcon(leave.status), color: statusColor.shade800, size: 20),
        ),
        title: Text(leave.reason),
        subtitle: Text(
          '${DateFormat.yMMMd().format(leave.from)} – ${DateFormat.yMMMd().format(leave.to)}\n'
          'Applied ${DateFormat.yMMMd().format(leave.appliedAt)}',
        ),
        isThreeLine: true,
        trailing: Chip(
          label: Text(
            leave.status.name,
            style: TextStyle(fontSize: 11, color: statusColor.shade900),
          ),
          backgroundColor: statusColor.shade50,
          visualDensity: VisualDensity.compact,
        ),
      ),
    );
  }

  IconData _statusIcon(LeaveStatus s) {
    switch (s) {
      case LeaveStatus.approved:
        return Icons.check_circle;
      case LeaveStatus.rejected:
        return Icons.cancel;
      case LeaveStatus.pending:
        return Icons.hourglass_top;
    }
  }
}
