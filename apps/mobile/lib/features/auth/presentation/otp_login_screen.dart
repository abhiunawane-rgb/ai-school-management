import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../core/auth/auth_state_provider.dart';
import '../../../core/demo/demo_store.dart';
import '../../../core/models/user_role.dart';

/// Sign in with role selection — demo mode for local testing without Firebase.
class OtpLoginScreen extends ConsumerStatefulWidget {
  const OtpLoginScreen({super.key});

  @override
  ConsumerState<OtpLoginScreen> createState() => _OtpLoginScreenState();
}

class _OtpLoginScreenState extends ConsumerState<OtpLoginScreen> {
  final _phoneController = TextEditingController();
  final _nameController = TextEditingController();
  final _otpController = TextEditingController();
  UserRole _role = UserRole.parent;
  bool _otpSent = false;
  bool _loading = false;

  Future<void> _signIn() async {
    if (_phoneController.text.trim().length < 8) {
      _showSnack('Enter a valid phone number');
      return;
    }
    if (_otpController.text.trim().length != 6) {
      _showSnack('Enter 6-digit OTP (use 123456 for testing)');
      return;
    }

    setState(() => _loading = true);
    try {
      final session = DemoSession(
        userName: _nameController.text.trim().isEmpty
            ? _role.label
            : _nameController.text.trim(),
        phone: _phoneController.text.trim(),
        role: _role,
        school: SchoolProfile.demo(),
      );
      await DemoStore.saveSession(session);
      ref.read(demoSessionProvider.notifier).state = session;
    } finally {
      if (mounted) setState(() => _loading = false);
    }
  }

  void _showSnack(String msg) {
    ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(msg)));
  }

  @override
  Widget build(BuildContext context) {
    final demoMode = ref.watch(demoModeProvider);

    return Scaffold(
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(24),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              const SizedBox(height: 32),
              Text(
                'AI School Management',
                style: Theme.of(context).textTheme.headlineSmall?.copyWith(
                      fontWeight: FontWeight.bold,
                    ),
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: 8),
              Text(
                demoMode
                    ? 'Local test mode — select your role and sign in'
                    : 'Sign in with OTP',
                textAlign: TextAlign.center,
                style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                      color: Colors.grey.shade600,
                    ),
              ),
              if (demoMode)
                Padding(
                  padding: const EdgeInsets.only(top: 12),
                  child: Material(
                    color: Colors.amber.shade50,
                    borderRadius: BorderRadius.circular(12),
                    child: Padding(
                      padding: const EdgeInsets.all(12),
                      child: Text(
                        'Test OTP: 123456 · School profile is set up on the web admin (port 3001) or uses demo school here.',
                        style: TextStyle(fontSize: 12, color: Colors.amber.shade900),
                      ),
                    ),
                  ),
                ),
              const SizedBox(height: 32),
              Text('I am a', style: Theme.of(context).textTheme.titleSmall),
              const SizedBox(height: 8),
              Wrap(
                spacing: 8,
                runSpacing: 8,
                children: UserRole.values.map((role) {
                  final selected = _role == role;
                  return FilterChip(
                    label: Text(role.label),
                    selected: selected,
                    onSelected: (_) => setState(() => _role = role),
                  );
                }).toList(),
              ),
              Padding(
                padding: const EdgeInsets.only(top: 8, bottom: 16),
                child: Text(
                  _role.description,
                  style: Theme.of(context).textTheme.bodySmall?.copyWith(
                        color: Colors.grey.shade600,
                      ),
                ),
              ),
              TextField(
                controller: _nameController,
                decoration: const InputDecoration(
                  labelText: 'Your name (optional)',
                  border: OutlineInputBorder(),
                ),
              ),
              const SizedBox(height: 12),
              TextField(
                controller: _phoneController,
                keyboardType: TextInputType.phone,
                decoration: const InputDecoration(
                  labelText: 'Mobile number',
                  border: OutlineInputBorder(),
                ),
              ),
              const SizedBox(height: 12),
              if (!_otpSent) ...[
                FilledButton(
                  onPressed: _loading
                      ? null
                      : () {
                          if (_phoneController.text.trim().length < 8) {
                            _showSnack('Enter phone number first');
                            return;
                          }
                          setState(() => _otpSent = true);
                        },
                  child: const Text('Send OTP'),
                ),
              ] else ...[
                TextField(
                  controller: _otpController,
                  keyboardType: TextInputType.number,
                  maxLength: 6,
                  decoration: const InputDecoration(
                    labelText: '6-digit OTP',
                    hintText: '123456',
                    border: OutlineInputBorder(),
                  ),
                ),
                const SizedBox(height: 8),
                FilledButton(
                  onPressed: _loading ? null : _signIn,
                  child: _loading
                      ? const SizedBox(
                          height: 22,
                          width: 22,
                          child: CircularProgressIndicator(strokeWidth: 2),
                        )
                      : Text('Sign in as ${_role.label}'),
                ),
                TextButton(
                  onPressed: () => setState(() => _otpSent = false),
                  child: const Text('Change number'),
                ),
              ],
            ],
          ),
        ),
      ),
    );
  }
}
