import 'dart:convert';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:http/http.dart' as http;
import '../models/vehicle.dart';

class AuthService {
  final FlutterSecureStorage _storage = const FlutterSecureStorage();
  List<Vehicle> _vehicles = [];

  List<Vehicle> get vehicles => _vehicles;

  // Validate API key with the server and fetch vehicles
  Future<bool> validateApiKey(String apiKey) async {
    try {
      final response = await http.post(
        Uri.parse('https://rover32.davidecose.com/api/app/login'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({'apiKey': apiKey}),
      ).timeout(const Duration(seconds: 10));

      if (response.statusCode == 200) {
        final Map<String, dynamic> data = jsonDecode(response.body);
        if (data['success'] == true) {
          // store API key
          await _storage.write(key: 'api_key', value: apiKey);
          // parse vehicles
          var user = data['user'] as Map<String, dynamic>?;
          if (user != null && user['vehicles'] is List) {
            _vehicles = (user['vehicles'] as List)
                .map((v) => Vehicle.fromJson(v as Map<String, dynamic>))
                .toList();
          }
          return true;
        }
      }
      return false;
    } catch (e) {
      print('Authentication error: $e');
      return false;
    }
  }

  // Check if user is already logged in
  Future<bool> isLoggedIn() async {
    final apiKey = await _storage.read(key: 'api_key');
    return apiKey != null;
  }

  // Get the stored API key
  Future<String?> getApiKey() async {
    return await _storage.read(key: 'api_key');
  }

  // Log out (clear stored API key)
  Future<void> logout() async {
    await _storage.delete(key: 'api_key');
  }

  // Sync vehicle stats with server
  Future<bool> updateVehicleStats({required String macAddress, required double uptimeHours, required double controlHours, required double kilometersDriven}) async {
    try {
      final apiKey = await _storage.read(key: 'api_key');
      if (apiKey == null) return false;
      final body = {
        'apiKey': apiKey,
        'macAddress': macAddress,
        'uptimeHours': uptimeHours,
        'controlHours': controlHours,
        'kilometersDriven': kilometersDriven
      };
      final response = await http.post(
        Uri.parse('https://rover32.davidecose.com/api/app/vehicle/receive'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode(body),
      ).timeout(const Duration(seconds: 10));
      if (response.statusCode == 200) {
        final Map<String, dynamic> data = jsonDecode(response.body);
        return data['success'] == true;
      }
      return false;
    } catch (e) {
      print('Stats sync error: $e');
      return false;
    }
  }
}