import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'services/auth_service.dart';
import 'services/rover_service.dart';
import 'screens/login_screen.dart';
import 'screens/rover_controller_screen.dart';
import 'models/vehicle.dart';

void main() {
  WidgetsFlutterBinding.ensureInitialized();
  runApp(const RoverApp());
}

class RoverApp extends StatelessWidget {
  const RoverApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MultiProvider(
      providers: [
        Provider<AuthService>(
          create: (_) => AuthService(),
        ),
        ChangeNotifierProvider<RoverService>(
          create: (_) => RoverService(),
        ),
      ],
      child: MaterialApp(
        title: 'Rover32 Controller',
        theme: ThemeData(
          colorScheme: ColorScheme.fromSeed(seedColor: Colors.blue),
          useMaterial3: true,
        ),
        home: const AppController(),
        debugShowCheckedModeBanner: false,
      ),
    );
  }
}

class AppController extends StatefulWidget {
  const AppController({super.key});

  @override
  State<AppController> createState() => _AppControllerState();
}

class _AppControllerState extends State<AppController> {
  bool _isLoggedIn = false;
  bool _isLoading = true;
  Vehicle? _selectedVehicle;

  @override
  void initState() {
    super.initState();
    _checkLoginStatus();
  }

  Future<void> _checkLoginStatus() async {
    final authService = Provider.of<AuthService>(context, listen: false);
    final isLoggedIn = await authService.isLoggedIn();

    setState(() {
      _isLoggedIn = isLoggedIn;
      _isLoading = false;
    });
  }

  void _handleLoginSuccess() {
    setState(() {
      _isLoggedIn = true;
      _selectedVehicle = null;
    });
  }

  void _handleLogout() async {
    final authService = Provider.of<AuthService>(context, listen: false);
    await authService.logout();

    setState(() {
      _isLoggedIn = false;
      _selectedVehicle = null;
    });
  }

  void _handleVehicleSelected(Vehicle vehicle) {
    setState(() {
      _selectedVehicle = vehicle;
    });
  }

  @override
  Widget build(BuildContext context) {
    if (_isLoading) {
      return const Scaffold(
        body: Center(child: CircularProgressIndicator()),
      );
    }
    if (!_isLoggedIn) {
      return LoginScreen(onLoginSuccess: _handleLoginSuccess);
    }
    if (_selectedVehicle == null) {
      return SelectVehicleScreen(
        onVehicleSelected: _handleVehicleSelected,
        onLogout: _handleLogout,
      );
    }
    return RoverControllerScreen(
      vehicle: _selectedVehicle!,
      onLogout: _handleLogout,
    );
  }
}

class SelectVehicleScreen extends StatefulWidget {
  final Function(Vehicle) onVehicleSelected;
  final VoidCallback onLogout;

  const SelectVehicleScreen({Key? key, required this.onVehicleSelected, required this.onLogout}) : super(key: key);

  @override
  State<SelectVehicleScreen> createState() => _SelectVehicleScreenState();
}

class _SelectVehicleScreenState extends State<SelectVehicleScreen> {
  final TextEditingController _ipController = TextEditingController();
  final TextEditingController _macController = TextEditingController();

  @override
  void dispose() {
    _ipController.dispose();
    _macController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final vehicles = Provider.of<AuthService>(context).vehicles;
    return Scaffold(
      appBar: AppBar(title: const Text('Select Vehicle'), actions: [
        IconButton(onPressed: widget.onLogout, icon: const Icon(Icons.logout))
      ]),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          children: [
            if (vehicles.isNotEmpty) ...[
              const Text('Select from your vehicles:'),
              const SizedBox(height: 10),
              Expanded(
                child: ListView(
                  children: vehicles.map((v) => ListTile(
                    title: Text(v.name),
                    subtitle: Text(v.ipAddress),
                    onTap: () => widget.onVehicleSelected(v),
                  )).toList(),
                ),
              ),
              const Divider(),
              const Text('Or enter manually:'),
            ],
            TextField(
              controller: _ipController,
              decoration: const InputDecoration(labelText: 'IP Address'),
            ),
            const SizedBox(height: 10),
            TextField(
              controller: _macController,
              decoration: const InputDecoration(labelText: 'MAC Address'),
            ),
            const SizedBox(height: 20),
            ElevatedButton(
              onPressed: () {
                final ip = _ipController.text.trim();
                final mac = _macController.text.trim();
                if (ip.isNotEmpty && mac.isNotEmpty) {
                  widget.onVehicleSelected(Vehicle(name: 'Manual', ipAddress: ip, macAddress: mac));
                }
              },
              child: const Text('Use Manual Entry'),
            )
          ],
        ),
      ),
    );
  }
}
