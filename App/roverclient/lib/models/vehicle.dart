class Vehicle {
  final String name;
  final String ipAddress;
  final String macAddress;

  Vehicle({required this.name, required this.ipAddress, required this.macAddress});

  factory Vehicle.fromJson(Map<String, dynamic> json) {
    return Vehicle(
      name: json['name'] as String,
      ipAddress: json['ipAddress'] as String,
      macAddress: json['macAddress'] as String,
    );
  }
}