import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../demo/demo_store.dart';
import '../models/user_role.dart';

/// When true, OTP uses local demo login (no Firebase Cloud Functions).
final demoModeProvider = StateProvider<bool>((ref) => true);

final firebaseAuthProvider = Provider<FirebaseAuth>((ref) {
  return FirebaseAuth.instance;
});

final firebaseUserProvider = StreamProvider<User?>((ref) {
  return ref.watch(firebaseAuthProvider).authStateChanges();
});

final demoSessionProvider = StateProvider<DemoSession?>((ref) {
  return DemoStore.loadSession();
});

class AppUser {
  AppUser({
    required this.displayName,
    required this.phone,
    required this.role,
    required this.school,
    this.isDemo = true,
  });

  final String displayName;
  final String phone;
  final UserRole role;
  final SchoolProfile school;
  final bool isDemo;
}

final currentUserProvider = Provider<AppUser?>((ref) {
  final demo = ref.watch(demoSessionProvider);
  if (demo != null) {
    return AppUser(
      displayName: demo.userName,
      phone: demo.phone,
      role: demo.role,
      school: demo.school,
      isDemo: true,
    );
  }
  final fb = ref.watch(firebaseUserProvider).valueOrNull;
  if (fb == null) return null;
  return AppUser(
    displayName: fb.displayName ?? 'User',
    phone: fb.phoneNumber ?? '',
    role: UserRole.parent,
    school: SchoolProfile.demo(),
    isDemo: false,
  );
});

final isLoggedInProvider = Provider<bool>((ref) {
  return ref.watch(currentUserProvider) != null;
});
