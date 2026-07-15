import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:intl/intl.dart';

import '../../../core/auth/auth_state_provider.dart';
import '../../../core/demo/calendar_store.dart';
import '../../../core/models/calendar_models.dart';
import '../../../core/models/user_role.dart';
import '../../../widgets/attendance_status_chip.dart';
import '../../../core/notifications/app_notifications.dart';

class AttendanceScreen extends ConsumerStatefulWidget {
  const AttendanceScreen({super.key});

  @override
  ConsumerState<AttendanceScreen> createState() => _AttendanceScreenState();
}

class _AttendanceScreenState extends ConsumerState<AttendanceScreen>
    with SingleTickerProviderStateMixin {
  late TabController _tabs;
  final _today = DateTime.now();
  Map<String, AttendanceMark> _classMarks = {};
  bool _loadingClass = true;
  bool _saved = false;

  @override
  void initState() {
    super.initState();
    _tabs = TabController(length: 2, vsync: this);
    _loadClassMarks();
  }

  Future<void> _loadClassMarks() async {
    final marks = await CalendarStore.loadClassAttendance(_today);
    if (mounted) {
      setState(() {
        _classMarks = marks;
        _loadingClass = false;
      });
    }
  }

  @override
  void dispose() {
    _tabs.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final user = ref.watch(currentUserProvider)!;
    final role = user.role;
    final records = CalendarStore.personalAttendance(role);
    final summary = CalendarStore.summarize(records);
    final title = _titleForRole(role);

    final showClassTab = role == UserRole.teacher;
    if (showClassTab && _tabs.length != 2) {
      _tabs = TabController(length: 2, vsync: this);
    }

    return Scaffold(
      appBar: AppBar(
        title: Text(title),
        bottom: showClassTab
            ? TabBar(
                controller: _tabs,
                tabs: const [
                  Tab(text: 'My record'),
                  Tab(text: 'Mark class'),
                ],
              )
            : null,
      ),
      body: showClassTab
          ? TabBarView(
              controller: _tabs,
              children: [
                _PersonalAttendanceBody(records: records, summary: summary, subtitle: user.displayName),
                _ClassMarkingBody(
                  marks: _classMarks,
                  loading: _loadingClass,
                  saved: _saved,
                  onMark: (id, status) => setState(() => _classMarks[id] = status),
                  onSave: _saveClassMarks,
                ),
              ],
            )
          : _PersonalAttendanceBody(
              records: records,
              summary: summary,
              subtitle: _subtitleForRole(role, user.displayName),
            ),
    );
  }

  String _titleForRole(UserRole role) {
    switch (role) {
      case UserRole.teacher:
        return 'Attendance';
      case UserRole.parent:
        return 'Child attendance';
      case UserRole.student:
        return 'My attendance';
      case UserRole.driver:
        return 'Duty attendance';
      default:
        return 'Attendance';
    }
  }

  String _subtitleForRole(UserRole role, String name) {
    switch (role) {
      case UserRole.parent:
        return 'Aarav Patel · Class 8-A';
      case UserRole.student:
        return name;
      case UserRole.driver:
        return 'Bus route 3 · $name';
      default:
        return name;
    }
  }

  Future<void> _saveClassMarks() async {
    await CalendarStore.saveClassAttendance(_today, _classMarks);
    if (mounted) {
      setState(() => _saved = true);
      AppNotifications.success(
        context,
        'Attendance saved',
        'Class attendance was saved for today.',
        solution: 'Parents can view updates in the app.',
      );
    }
  }
}

class _PersonalAttendanceBody extends StatelessWidget {
  const _PersonalAttendanceBody({
    required this.records,
    required this.summary,
    required this.subtitle,
  });

  final List<DailyAttendance> records;
  final AttendanceSummary summary;
  final String subtitle;

  @override
  Widget build(BuildContext context) {
    return ListView(
      padding: const EdgeInsets.all(16),
      children: [
        Text(subtitle, style: TextStyle(color: Colors.grey.shade700)),
        const SizedBox(height: 12),
        _SummaryRow(summary: summary),
        const SizedBox(height: 16),
        Text(
          'Last 30 school days',
          style: Theme.of(context).textTheme.titleSmall?.copyWith(fontWeight: FontWeight.bold),
        ),
        const SizedBox(height: 8),
        ...records.reversed.map(
          (r) => Card(
            margin: const EdgeInsets.only(bottom: 8),
            child: ListTile(
              leading: CircleAvatar(
                backgroundColor: Colors.grey.shade100,
                child: Text(
                  DateFormat.d().format(r.date),
                  style: const TextStyle(fontSize: 12, fontWeight: FontWeight.bold),
                ),
              ),
              title: Text(DateFormat.EEEE().format(r.date)),
              subtitle: r.note != null ? Text(r.note!) : null,
              trailing: AttendanceStatusChip(status: r.status),
            ),
          ),
        ),
      ],
    );
  }
}

class _SummaryRow extends StatelessWidget {
  const _SummaryRow({required this.summary});

  final AttendanceSummary summary;

  @override
  Widget build(BuildContext context) {
    return Row(
      children: [
        Expanded(
          child: _StatCard(
            label: 'Attendance',
            value: '${summary.attendancePercent.toStringAsFixed(0)}%',
            color: Colors.green,
          ),
        ),
        const SizedBox(width: 8),
        Expanded(child: _StatCard(label: 'Present', value: '${summary.present}', color: Colors.teal)),
        const SizedBox(width: 8),
        Expanded(child: _StatCard(label: 'Absent', value: '${summary.absent}', color: Colors.red)),
        const SizedBox(width: 8),
        Expanded(child: _StatCard(label: 'Leave', value: '${summary.onLeave}', color: Colors.blue)),
      ],
    );
  }
}

class _StatCard extends StatelessWidget {
  const _StatCard({required this.label, required this.value, required this.color});

  final String label;
  final String value;
  final Color color;

  @override
  Widget build(BuildContext context) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.symmetric(vertical: 12, horizontal: 8),
        child: Column(
          children: [
            Text(value, style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: color)),
            const SizedBox(height: 4),
            Text(label, style: TextStyle(fontSize: 10, color: Colors.grey.shade600), textAlign: TextAlign.center),
          ],
        ),
      ),
    );
  }
}

class _ClassMarkingBody extends StatelessWidget {
  const _ClassMarkingBody({
    required this.marks,
    required this.loading,
    required this.saved,
    required this.onMark,
    required this.onSave,
  });

  final Map<String, AttendanceMark> marks;
  final bool loading;
  final bool saved;
  final void Function(String id, AttendanceMark status) onMark;
  final VoidCallback onSave;

  @override
  Widget build(BuildContext context) {
    if (loading) {
      return const Center(child: CircularProgressIndicator());
    }
    final students = CalendarStore.classRoster();
    final dateLabel = DateFormat.yMMMd().format(DateTime.now());

    return Column(
      children: [
        Padding(
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text('Class 8-A · $dateLabel', style: Theme.of(context).textTheme.titleSmall),
              if (saved)
                Text('Saved', style: TextStyle(color: Colors.green.shade700, fontSize: 12)),
            ],
          ),
        ),
        Expanded(
          child: ListView.builder(
            padding: const EdgeInsets.symmetric(horizontal: 16),
            itemCount: students.length,
            itemBuilder: (context, i) {
              final s = students[i];
              final current = marks[s.id] ?? AttendanceMark.present;
              return Card(
                margin: const EdgeInsets.only(bottom: 10),
                child: Padding(
                  padding: const EdgeInsets.all(12),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(s.name, style: const TextStyle(fontWeight: FontWeight.w600)),
                      const SizedBox(height: 8),
                      Wrap(
                        spacing: 6,
                        children: AttendanceMark.values
                            .where((m) => m != AttendanceMark.holiday)
                            .map(
                              (m) => ChoiceChip(
                                label: Text(m.label, style: const TextStyle(fontSize: 11)),
                                selected: current == m,
                                onSelected: (_) => onMark(s.id, m),
                              ),
                            )
                            .toList(),
                      ),
                    ],
                  ),
                ),
              );
            },
          ),
        ),
        SafeArea(
          child: Padding(
            padding: const EdgeInsets.all(16),
            child: SizedBox(
              width: double.infinity,
              child: FilledButton(
                onPressed: onSave,
                child: const Text('Save today\'s attendance'),
              ),
            ),
          ),
        ),
      ],
    );
  }
}
