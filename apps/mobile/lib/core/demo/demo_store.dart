import 'dart:convert';

import 'package:hive_flutter/hive_flutter.dart';

import '../models/user_role.dart';

class SchoolProfile {
  SchoolProfile({
    required this.name,
    this.logoBase64,
    this.address = '',
    this.city = '',
    this.board = '',
    this.phone = '',
    this.email = '',
    this.principalName = '',
  });

  final String name;
  final String? logoBase64;
  final String address;
  final String city;
  final String board;
  final String phone;
  final String email;
  final String principalName;

  Map<String, dynamic> toJson() => {
        'name': name,
        'logoBase64': logoBase64,
        'address': address,
        'city': city,
        'board': board,
        'phone': phone,
        'email': email,
        'principalName': principalName,
      };

  factory SchoolProfile.fromJson(Map<String, dynamic> j) => SchoolProfile(
        name: j['name'] as String? ?? 'My School',
        logoBase64: j['logoBase64'] as String?,
        address: j['address'] as String? ?? '',
        city: j['city'] as String? ?? '',
        board: j['board'] as String? ?? '',
        phone: j['phone'] as String? ?? '',
        email: j['email'] as String? ?? '',
        principalName: j['principalName'] as String? ?? '',
      );

  static SchoolProfile demo() => SchoolProfile(
        name: 'Green Valley International School',
        address: '12 Education Lane',
        city: 'Pune',
        board: 'CBSE',
        phone: '+91 98765 43210',
        email: 'admin@greenvalley.edu.in',
        principalName: 'Dr. Priya Sharma',
      );
}

class DemoSession {
  DemoSession({
    required this.userName,
    required this.phone,
    required this.role,
    required this.school,
  });

  final String userName;
  final String phone;
  final UserRole role;
  final SchoolProfile school;

  Map<String, dynamic> toJson() => {
        'userName': userName,
        'phone': phone,
        'role': role.id,
        'school': school.toJson(),
      };

  factory DemoSession.fromJson(Map<String, dynamic> j) => DemoSession(
        userName: j['userName'] as String? ?? 'User',
        phone: j['phone'] as String? ?? '',
        role: UserRole.fromId(j['role'] as String?) ?? UserRole.parent,
        school: SchoolProfile.fromJson(j['school'] as Map<String, dynamic>? ?? {}),
      );
}

class DemoStore {
  static const _boxName = 'aischool_mobile';
  static const _sessionKey = 'session';

  static Future<void> init() async {
    await Hive.initFlutter();
    await Hive.openBox<String>(_boxName);
  }

  static Box<String> get _box => Hive.box<String>(_boxName);

  static DemoSession? loadSession() {
    final raw = _box.get(_sessionKey);
    if (raw == null) return null;
    return DemoSession.fromJson(jsonDecode(raw) as Map<String, dynamic>);
  }

  static Future<void> saveSession(DemoSession session) async {
    await _box.put(_sessionKey, jsonEncode(session.toJson()));
  }

  static Future<void> clearSession() async {
    await _box.delete(_sessionKey);
  }

  static Future<void> updateSchool(SchoolProfile school) async {
    final session = loadSession();
    if (session == null) return;
    await saveSession(DemoSession(
      userName: session.userName,
      phone: session.phone,
      role: session.role,
      school: school,
    ));
  }
}
