import 'dart:convert';

import 'package:flutter/material.dart';

import '../core/demo/demo_store.dart';

class SchoolHeader extends StatelessWidget {
  const SchoolHeader({super.key, required this.school, this.subtitle});

  final SchoolProfile school;
  final String? subtitle;

  @override
  Widget build(BuildContext context) {
    return Row(
      children: [
        _Logo(logoBase64: school.logoBase64),
        const SizedBox(width: 12),
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                school.name,
                style: Theme.of(context).textTheme.titleMedium?.copyWith(
                      fontWeight: FontWeight.bold,
                    ),
                maxLines: 2,
                overflow: TextOverflow.ellipsis,
              ),
              if (subtitle != null)
                Text(
                  subtitle!,
                  style: Theme.of(context).textTheme.bodySmall?.copyWith(
                        color: Colors.grey.shade600,
                      ),
                ),
            ],
          ),
        ),
      ],
    );
  }
}

class _Logo extends StatelessWidget {
  const _Logo({this.logoBase64});

  final String? logoBase64;

  @override
  Widget build(BuildContext context) {
    if (logoBase64 != null && logoBase64!.startsWith('data:image')) {
      try {
        final bytes = base64Decode(logoBase64!.split(',').last);
        return ClipRRect(
          borderRadius: BorderRadius.circular(10),
          child: Image.memory(bytes, width: 48, height: 48, fit: BoxFit.cover),
        );
      } catch (_) {
        /* fall through */
      }
    }
    return CircleAvatar(
      radius: 24,
      backgroundColor: Theme.of(context).colorScheme.primaryContainer,
      child: Icon(Icons.school, color: Theme.of(context).colorScheme.primary),
    );
  }
}
