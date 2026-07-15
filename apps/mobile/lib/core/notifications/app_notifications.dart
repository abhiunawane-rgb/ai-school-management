import 'package:flutter/material.dart';

/// Consistent in-app alerts — success, error, warning, info with optional fix hint.
class AppNotifications {
  const AppNotifications._();

  static void show(
    BuildContext context, {
    required String title,
    required String message,
    String? solution,
    Color? backgroundColor,
    IconData? icon,
    Duration duration = const Duration(seconds: 5),
  }) {
    final messenger = ScaffoldMessenger.maybeOf(context);
    if (messenger == null) return;

    messenger.clearSnackBars();
    messenger.showSnackBar(
      SnackBar(
        behavior: SnackBarBehavior.floating,
        backgroundColor: backgroundColor ?? const Color(0xFF1E293B),
        duration: duration,
        content: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                if (icon != null) ...[
                  Icon(icon, color: Colors.white, size: 20),
                  const SizedBox(width: 8),
                ],
                Expanded(
                  child: Text(
                    title,
                    style: const TextStyle(fontWeight: FontWeight.w600, fontSize: 15),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 4),
            Text(message, style: const TextStyle(fontSize: 13)),
            if (solution != null) ...[
              const SizedBox(height: 6),
              Text(
                'Fix: $solution',
                style: TextStyle(fontSize: 12, color: Colors.white.withValues(alpha: 0.85)),
              ),
            ],
          ],
        ),
      ),
    );
  }

  static void success(BuildContext context, String title, String message, {String? solution}) {
    show(
      context,
      title: title,
      message: message,
      solution: solution,
      backgroundColor: const Color(0xFF059669),
      icon: Icons.check_circle_outline,
    );
  }

  static void error(BuildContext context, String title, String message, {String? solution}) {
    show(
      context,
      title: title,
      message: message,
      solution: solution,
      backgroundColor: const Color(0xFFDC2626),
      icon: Icons.error_outline,
      duration: const Duration(seconds: 8),
    );
  }

  static void warning(BuildContext context, String title, String message, {String? solution}) {
    show(
      context,
      title: title,
      message: message,
      solution: solution,
      backgroundColor: const Color(0xFFD97706),
      icon: Icons.warning_amber_outlined,
      duration: const Duration(seconds: 7),
    );
  }

  static void info(BuildContext context, String title, String message, {String? solution}) {
    show(
      context,
      title: title,
      message: message,
      solution: solution,
      backgroundColor: const Color(0xFF4F46E5),
      icon: Icons.info_outline,
    );
  }
}
