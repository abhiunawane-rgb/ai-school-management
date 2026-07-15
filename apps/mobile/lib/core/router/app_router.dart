import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../features/auth/presentation/otp_login_screen.dart';
import '../../features/home/presentation/role_home_screen.dart';
import '../../features/bus/presentation/bus_tracking_screen.dart';
import '../../features/ai/presentation/ai_chat_screen.dart';
import '../../features/school/presentation/school_profile_screen.dart';
import '../../features/calendar/presentation/holiday_calendar_screen.dart';
import '../../features/attendance/presentation/attendance_screen.dart';
import '../../features/leaves/presentation/leaves_screen.dart';
import '../../features/academic/presentation/homework_screen.dart';
import '../../features/academic/presentation/notices_screen.dart';
import '../../features/academic/presentation/timetable_screen.dart';
import '../../features/academic/presentation/fees_screen.dart';
import '../../features/academic/presentation/driver_route_screen.dart';
import '../../features/academic/presentation/emergency_screen.dart';
import '../auth/auth_state_provider.dart';

final appRouterProvider = Provider<GoRouter>((ref) {
  final loggedIn = ref.watch(isLoggedInProvider);

  return GoRouter(
    initialLocation: '/login',
    refreshListenable: _RouterRefresh(ref),
    redirect: (context, state) {
      final isLogin = state.matchedLocation == '/login';
      if (!loggedIn && !isLogin) return '/login';
      if (loggedIn && isLogin) return '/home';
      return null;
    },
    routes: [
      GoRoute(
        path: '/login',
        builder: (context, state) => const OtpLoginScreen(),
      ),
      GoRoute(
        path: '/home',
        builder: (context, state) => const RoleHomeScreen(),
      ),
      GoRoute(
        path: '/school-profile',
        builder: (context, state) => const SchoolProfileScreen(),
      ),
      GoRoute(
        path: '/bus-tracking',
        builder: (context, state) => const BusTrackingScreen(),
      ),
      GoRoute(
        path: '/ai-chat',
        builder: (context, state) => const AiChatScreen(),
      ),
      GoRoute(
        path: '/attendance',
        builder: (context, state) => const AttendanceScreen(),
      ),
      GoRoute(
        path: '/leaves',
        builder: (context, state) => const LeavesScreen(),
      ),
      GoRoute(
        path: '/holidays',
        builder: (context, state) => const HolidayCalendarScreen(),
      ),
      GoRoute(
        path: '/homework',
        builder: (context, state) => const HomeworkScreen(),
      ),
      GoRoute(
        path: '/notices',
        builder: (context, state) => const NoticesScreen(),
      ),
      GoRoute(
        path: '/timetable',
        builder: (context, state) => const TimetableScreen(),
      ),
      GoRoute(
        path: '/fees',
        builder: (context, state) => const FeesScreen(),
      ),
      GoRoute(
        path: '/driver-route',
        builder: (context, state) => const DriverRouteScreen(),
      ),
      GoRoute(
        path: '/emergency',
        builder: (context, state) => const EmergencyScreen(),
      ),
    ],
  );
});

class _RouterRefresh extends ChangeNotifier {
  _RouterRefresh(this.ref) {
    ref.listen(isLoggedInProvider, (_, __) => notifyListeners());
    ref.listen(demoSessionProvider, (_, __) => notifyListeners());
  }
  final Ref ref;
}
