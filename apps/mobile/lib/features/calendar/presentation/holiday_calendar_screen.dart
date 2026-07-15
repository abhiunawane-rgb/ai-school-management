import 'package:flutter/material.dart';
import 'package:intl/intl.dart';

import '../../../core/demo/calendar_store.dart';
import '../../../core/models/calendar_models.dart';

class HolidayCalendarScreen extends StatefulWidget {
  const HolidayCalendarScreen({super.key});

  @override
  State<HolidayCalendarScreen> createState() => _HolidayCalendarScreenState();
}

class _HolidayCalendarScreenState extends State<HolidayCalendarScreen> {
  late DateTime _focusedMonth;
  final _holidays = CalendarStore.holidays();

  @override
  void initState() {
    super.initState();
    final now = DateTime.now();
    _focusedMonth = DateTime(now.year, now.month);
  }

  @override
  Widget build(BuildContext context) {
    final holidayMap = {
      for (final h in _holidays) _key(h.date): h,
    };
    final daysInMonth = DateUtils.getDaysInMonth(_focusedMonth.year, _focusedMonth.month);
    final firstWeekday = DateTime(_focusedMonth.year, _focusedMonth.month, 1).weekday;

    final upcoming = _holidays.where((h) => !h.date.isBefore(DateTime.now())).toList()
      ..sort((a, b) => a.date.compareTo(b.date));

    return Scaffold(
      appBar: AppBar(title: const Text('Holiday calendar')),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              IconButton(
                onPressed: () => setState(() {
                  _focusedMonth = DateTime(_focusedMonth.year, _focusedMonth.month - 1);
                }),
                icon: const Icon(Icons.chevron_left),
              ),
              Text(
                DateFormat.yMMMM().format(_focusedMonth),
                style: Theme.of(context).textTheme.titleMedium?.copyWith(fontWeight: FontWeight.bold),
              ),
              IconButton(
                onPressed: () => setState(() {
                  _focusedMonth = DateTime(_focusedMonth.year, _focusedMonth.month + 1);
                }),
                icon: const Icon(Icons.chevron_right),
              ),
            ],
          ),
          const SizedBox(height: 8),
          Row(
            children: ['M', 'T', 'W', 'T', 'F', 'S', 'S']
                .map(
                  (d) => Expanded(
                    child: Center(
                      child: Text(d, style: TextStyle(fontSize: 12, color: Colors.grey.shade600)),
                    ),
                  ),
                )
                .toList(),
          ),
          const SizedBox(height: 8),
          GridView.builder(
            shrinkWrap: true,
            physics: const NeverScrollableScrollPhysics(),
            gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(crossAxisCount: 7),
            itemCount: firstWeekday % 7 + daysInMonth,
            itemBuilder: (context, index) {
              if (index < firstWeekday % 7) return const SizedBox.shrink();
              final day = index - firstWeekday % 7 + 1;
              final date = DateTime(_focusedMonth.year, _focusedMonth.month, day);
              final key = _key(date);
              final holiday = holidayMap[key];
              final isWeekend = date.weekday == DateTime.saturday || date.weekday == DateTime.sunday;
              final isToday = _key(DateTime.now()) == key;

              Color? bg;
              Color fg = Colors.black87;
              if (holiday != null) {
                bg = Colors.purple.shade100;
                fg = Colors.purple.shade900;
              } else if (isWeekend) {
                bg = Colors.grey.shade200;
                fg = Colors.grey.shade700;
              } else if (isToday) {
                bg = Theme.of(context).colorScheme.primaryContainer;
              }

              return Container(
                margin: const EdgeInsets.all(2),
                decoration: BoxDecoration(
                  color: bg,
                  borderRadius: BorderRadius.circular(8),
                  border: isToday ? Border.all(color: Theme.of(context).colorScheme.primary, width: 2) : null,
                ),
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Text('$day', style: TextStyle(fontWeight: FontWeight.w600, color: fg, fontSize: 13)),
                    if (holiday != null)
                      Container(
                        width: 6,
                        height: 6,
                        decoration: BoxDecoration(color: Colors.purple.shade700, shape: BoxShape.circle),
                      ),
                  ],
                ),
              );
            },
          ),
          const SizedBox(height: 8),
          Wrap(
            spacing: 12,
            runSpacing: 8,
            children: [
              _legend(Colors.purple.shade100, 'Holiday'),
              _legend(Colors.grey.shade200, 'Weekend'),
              _legend(Theme.of(context).colorScheme.primaryContainer, 'Today'),
            ],
          ),
          const SizedBox(height: 24),
          Text(
            'Upcoming holidays',
            style: Theme.of(context).textTheme.titleMedium?.copyWith(fontWeight: FontWeight.bold),
          ),
          const SizedBox(height: 8),
          if (upcoming.isEmpty)
            const Text('No upcoming holidays this year.')
          else
            ...upcoming.map((h) => _HolidayTile(holiday: h)),
        ],
      ),
    );
  }

  Widget _legend(Color color, String label) {
    return Row(
      mainAxisSize: MainAxisSize.min,
      children: [
        Container(width: 14, height: 14, decoration: BoxDecoration(color: color, borderRadius: BorderRadius.circular(4))),
        const SizedBox(width: 6),
        Text(label, style: const TextStyle(fontSize: 12)),
      ],
    );
  }

  String _key(DateTime d) =>
      '${d.year}-${d.month.toString().padLeft(2, '0')}-${d.day.toString().padLeft(2, '0')}';
}

class _HolidayTile extends StatelessWidget {
  const _HolidayTile({required this.holiday});

  final SchoolHoliday holiday;

  @override
  Widget build(BuildContext context) {
    return Card(
      margin: const EdgeInsets.only(bottom: 8),
      child: ListTile(
        leading: CircleAvatar(
          backgroundColor: Colors.purple.shade100,
          child: Icon(Icons.celebration, color: Colors.purple.shade800, size: 20),
        ),
        title: Text(holiday.title),
        subtitle: Text(DateFormat.yMMMd().format(holiday.date)),
        trailing: holiday.isOptional
            ? Chip(
                label: const Text('Optional', style: TextStyle(fontSize: 10)),
                visualDensity: VisualDensity.compact,
              )
            : null,
      ),
    );
  }
}
