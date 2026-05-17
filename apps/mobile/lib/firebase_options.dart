// Firebase configuration for AI School Management
// Generated from project google-services.json / GoogleService-Info.plist

import 'package:firebase_core/firebase_core.dart' show FirebaseOptions;
import 'package:flutter/foundation.dart'
    show defaultTargetPlatform, kIsWeb, TargetPlatform;

class DefaultFirebaseOptions {
  static FirebaseOptions get currentPlatform {
    if (kIsWeb) {
      return web;
    }
    switch (defaultTargetPlatform) {
      case TargetPlatform.android:
        return android;
      case TargetPlatform.iOS:
        return ios;
      case TargetPlatform.macOS:
        return ios;
      default:
        return android;
    }
  }

  static const FirebaseOptions web = FirebaseOptions(
    apiKey: 'AIzaSyBuZEbPBKVThXgSynCdlU26tiiPJnE9cik',
    appId: '1:937134255900:android:51c0db760a503a1926d4d9',
    messagingSenderId: '937134255900',
    projectId: 'ai-school-management-3abe1',
    storageBucket: 'ai-school-management-3abe1.firebasestorage.app',
  );

  static const FirebaseOptions android = FirebaseOptions(
    apiKey: 'AIzaSyBuZEbPBKVThXgSynCdlU26tiiPJnE9cik',
    appId: '1:937134255900:android:51c0db760a503a1926d4d9',
    messagingSenderId: '937134255900',
    projectId: 'ai-school-management-3abe1',
    storageBucket: 'ai-school-management-3abe1.firebasestorage.app',
  );

  static const FirebaseOptions ios = FirebaseOptions(
    apiKey: 'AIzaSyAqQd0nAmpbbobbT6n9rs0TFravKaqCRSA',
    appId: '1:937134255900:ios:e4d074b49ae91ecc26d4d9',
    messagingSenderId: '937134255900',
    projectId: 'ai-school-management-3abe1',
    storageBucket: 'ai-school-management-3abe1.firebasestorage.app',
    iosBundleId: 'com.aischool.management',
  );
}
