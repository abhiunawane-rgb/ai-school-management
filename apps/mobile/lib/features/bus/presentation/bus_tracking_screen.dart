import 'package:flutter/material.dart';
import 'package:google_maps_flutter/google_maps_flutter.dart';

class BusTrackingScreen extends StatefulWidget {
  const BusTrackingScreen({super.key});

  @override
  State<BusTrackingScreen> createState() => _BusTrackingScreenState();
}

class _BusTrackingScreenState extends State<BusTrackingScreen> {
  static const _defaultPosition = LatLng(28.6139, 77.2090);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Bus Tracking')),
      body: GoogleMap(
        initialCameraPosition: const CameraPosition(
          target: _defaultPosition,
          zoom: 14,
        ),
        markers: {
          const Marker(
            markerId: MarkerId('bus'),
            position: _defaultPosition,
            infoWindow: InfoWindow(title: 'School Bus'),
          ),
        },
        myLocationEnabled: true,
      ),
    );
  }
}
