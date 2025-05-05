import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_joystick/flutter_joystick.dart';
import 'package:flutter_keyboard_visibility/flutter_keyboard_visibility.dart';
import 'package:provider/provider.dart';
import 'dart:ui' as ui;
import 'dart:async';
import 'dart:math';

import '../services/rover_service.dart';
import '../models/vehicle.dart';
import '../services/auth_service.dart';

class RoverControllerScreen extends StatefulWidget {
  final VoidCallback onLogout;
  final Vehicle vehicle;

  const RoverControllerScreen({Key? key, required this.onLogout, required this.vehicle}) : super(key: key);

  @override
  State<RoverControllerScreen> createState() => _RoverControllerScreenState();
}

class _RoverControllerScreenState extends State<RoverControllerScreen> {
  final TextEditingController _ipController = TextEditingController();
  final FocusNode _ipFocusNode = FocusNode();
  Timer? _statsTimer;
  int _secondsConnected = 0;
  int _controlSeconds = 0;
  bool _isForward = false;
  bool _isBackward = false;
  bool _isSteeringLeft = false;
  bool _isSteeringRight = false;
  int _steeringAngle = 90;
  bool _lightsOn = false;
  late FocusNode _keyboardFocusNode;
  late VoidCallback _serviceListener;

  @override
  void initState() {
    super.initState();
    _ipController.text = widget.vehicle.ipAddress;
    _setupKeyboardListeners();
    _keyboardFocusNode = FocusNode();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      FocusScope.of(context).requestFocus(_keyboardFocusNode);
    });

    final roverService = Provider.of<RoverService>(context, listen: false);
    _serviceListener = () {
      if (!roverService.isConnected) {
        _statsTimer?.cancel();
        // regain keyboard focus so controls remain responsive
        FocusScope.of(context).requestFocus(_keyboardFocusNode);
      }
    };
    roverService.addListener(_serviceListener);
  }

  @override
  void dispose() {
    _statsTimer?.cancel();
    _ipController.dispose();
    _ipFocusNode.dispose();
    _keyboardFocusNode.dispose();
    Provider.of<RoverService>(context, listen: false).removeListener(_serviceListener);
    super.dispose();
  }

  void _setupKeyboardListeners() {
    _ipFocusNode.addListener(() {
      setState(() {});
    });
  }



  void _handleKeyEvent(RawKeyEvent event) {
    if (_ipFocusNode.hasFocus) return;

    final RoverService roverService = Provider.of<RoverService>(context, listen: false);
    if (!roverService.isConnected) return;
    
    if (event is RawKeyDownEvent) {
      if (event.logicalKey == LogicalKeyboardKey.keyW ||
          event.logicalKey == LogicalKeyboardKey.arrowUp) {
        if (!_isForward) {
          setState(() => _isForward = true);
          roverService.sendCommand('forward');
        }
      } else if (event.logicalKey == LogicalKeyboardKey.keyS ||
                 event.logicalKey == LogicalKeyboardKey.arrowDown) {
        if (!_isBackward) {
          setState(() => _isBackward = true);
          roverService.sendCommand('backward');
        }
      } else if (event.logicalKey == LogicalKeyboardKey.keyA ||
                 event.logicalKey == LogicalKeyboardKey.arrowLeft) {
        if (!_isSteeringLeft) {
          setState(() {
            _isSteeringLeft = true;
            _steeringAngle = 60;
          });
          roverService.sendCommand('steer:60');
        }
      } else if (event.logicalKey == LogicalKeyboardKey.keyD ||
                 event.logicalKey == LogicalKeyboardKey.arrowRight) {
        if (!_isSteeringRight) {
          setState(() {
            _isSteeringRight = true;
            _steeringAngle = 120;
          });
          roverService.sendCommand('steer:120');
        }
      } else if (event.logicalKey == LogicalKeyboardKey.keyQ) {
        roverService.sendCommand('drift');
      } else if (event.logicalKey == LogicalKeyboardKey.keyE) {
        roverService.sendCommand('drift1');
      } else if (event.logicalKey == LogicalKeyboardKey.space) {
        _stopMovement(roverService);
      }
    } else if (event is RawKeyUpEvent) {
      if (event.logicalKey == LogicalKeyboardKey.keyW ||
          event.logicalKey == LogicalKeyboardKey.arrowUp) {
        if (_isForward) {
          setState(() => _isForward = false);
          roverService.sendCommand('stop');
        }
      } else if (event.logicalKey == LogicalKeyboardKey.keyS ||
                 event.logicalKey == LogicalKeyboardKey.arrowDown) {
        if (_isBackward) {
          setState(() => _isBackward = false);
          roverService.sendCommand('stop');
        }
      } else if (event.logicalKey == LogicalKeyboardKey.keyA ||
                 event.logicalKey == LogicalKeyboardKey.arrowLeft) {
        if (_isSteeringLeft) {
          setState(() {
            _isSteeringLeft = false;
            _steeringAngle = 90;
          });
          roverService.sendCommand('steer:90');
        }
      } else if (event.logicalKey == LogicalKeyboardKey.keyD ||
                 event.logicalKey == LogicalKeyboardKey.arrowRight) {
        if (_isSteeringRight) {
          setState(() {
            _isSteeringRight = false;
            _steeringAngle = 90;
          });
          roverService.sendCommand('steer:90');
        }
      }
    }
  }


  void _stopMovement(RoverService roverService) {
    final bool wasSteeringNotCenter = _steeringAngle != 90;
    setState(() {
      _isForward = false;
      _isBackward = false;
      _steeringAngle = 90;
      _isSteeringLeft = false;
      _isSteeringRight = false;
    });
    roverService.sendCommand('stop');
    if (wasSteeringNotCenter) {
      roverService.sendCommand('steer:90');
    }
  }

  void _handleJoystickMove(StickDragDetails details) {
    final RoverService roverService = Provider.of<RoverService>(context, listen: false);
    if (!roverService.isConnected) return;
    
    // invert joystick axes
    double x = -details.x;
    double y = -details.y;
    
    if (y > 0.2) {
      if (!_isForward) {
        setState(() {
          _isForward = true;
          _isBackward = false;
        });
        roverService.sendCommand('forward');
      }
    } else if (y < -0.2) {
      if (!_isBackward) {
        setState(() {
          _isBackward = true;
          _isForward = false;
        });
        roverService.sendCommand('backward');
      }
    } else {
      if (_isForward || _isBackward) {
        setState(() {
          _isForward = false;
          _isBackward = false;
        });
        roverService.sendCommand('stop');
      }
    }
    
    if (x.abs() > 0.2) {
      int steeringValue = 90 + (x * 60).round();
      steeringValue = steeringValue.clamp(30, 150);
      
      if (_steeringAngle != steeringValue) {
        setState(() {
          _steeringAngle = steeringValue;
          _isSteeringLeft = steeringValue < 90;
          _isSteeringRight = steeringValue > 90;
        });
        roverService.sendCommand('steer:$steeringValue');
      }
    } else if (_steeringAngle != 90) {
      setState(() {
        _steeringAngle = 90;
        _isSteeringLeft = false;
        _isSteeringRight = false;
      });
      roverService.sendCommand('steer:90');
    }
  }

  void _handleJoystickEnd() {
    final RoverService roverService = Provider.of<RoverService>(context, listen: false);
    if (!roverService.isConnected) return;
    
    _stopMovement(roverService);
  }

  Future<void> _connect() async {
    final roverService = Provider.of<RoverService>(context, listen: false);
    roverService.setIpAddress(widget.vehicle.ipAddress);
    final success = await roverService.connect();
    if (success) {
      _statsTimer = Timer.periodic(const Duration(seconds: 1), (_) {
        setState(() {
          _secondsConnected++;
          _controlSeconds++;
        });
      });
      // regain keyboard focus after connecting
      WidgetsBinding.instance.addPostFrameCallback((_) {
        // ensure IP TextField is unfocused
        _ipFocusNode.unfocus();
        FocusScope.of(context).requestFocus(_keyboardFocusNode);
      });
    }
  }

  Future<void> _disconnect() async {
    _statsTimer?.cancel();
    final double uptimeHours = _secondsConnected / 3600;
    final double controlHours = _controlSeconds / 3600;
    final double kilometersDriven = _secondsConnected * 0.001;
    final authService = Provider.of<AuthService>(context, listen: false);
    await authService.updateVehicleStats(
      macAddress: widget.vehicle.macAddress,
      uptimeHours: uptimeHours,
      controlHours: controlHours,
      kilometersDriven: kilometersDriven,
    );
    _secondsConnected = 0;
    _controlSeconds = 0;
    final roverService = Provider.of<RoverService>(context, listen: false);
    _stopMovement(roverService);
    roverService.disconnect();
  }

  void _toggleLights() {
    final RoverService roverService = Provider.of<RoverService>(context, listen: false);
    if (!roverService.isConnected) return;
    
    setState(() {
      _lightsOn = !_lightsOn;
    });
    
    if (_lightsOn) {
      roverService.sendCommand('onHeadlights');
    } else {
      roverService.sendCommand('offHeadlights');
    }
  }

  Widget _buildConnectionPanel() {
    final RoverService roverService = Provider.of<RoverService>(context);
    
    return Padding(
      padding: const EdgeInsets.all(8.0),
      child: Row(
        children: [
          Expanded(
            child: TextField(
              controller: _ipController,
              focusNode: _ipFocusNode,
              decoration: const InputDecoration(
                labelText: 'ESP32 IP Address',
                border: OutlineInputBorder(),
                contentPadding: EdgeInsets.symmetric(horizontal: 10),
              ),
              enabled: !roverService.isConnected,
            ),
          ),
          const SizedBox(width: 8),
          ElevatedButton(
            onPressed: roverService.isConnected ? _disconnect : _connect,
            style: ElevatedButton.styleFrom(
              padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 15),
              backgroundColor: roverService.isConnected ? Colors.red : Colors.green,
            ),
            child: Text(roverService.isConnected ? 'Disconnect' : 'Connect'),
          ),
          const SizedBox(width: 8),
          ElevatedButton(
            onPressed: widget.onLogout,
            style: ElevatedButton.styleFrom(
              padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 15),
            ),
            child: const Text('Logout'),
          ),
        ],
      ),
    );
  }

  Widget _buildVideoFeed() {
    final RoverService roverService = Provider.of<RoverService>(context);
    
    return Expanded(
      child: Container(
        margin: const EdgeInsets.all(8.0),
        decoration: BoxDecoration(
          color: Colors.black,
          border: Border.all(color: Colors.grey),
          borderRadius: BorderRadius.circular(4),
        ),
        child: Stack(
          children: [
            Center(
              child: roverService.currentFrame != null
                  ? AspectRatio(
                      aspectRatio: (roverService.rotationDegrees % 180 == 0)
                          ? roverService.currentFrame!.width / roverService.currentFrame!.height
                          : roverService.currentFrame!.height / roverService.currentFrame!.width,
                      child: AnimatedRotation(
                        turns: roverService.rotationDegrees / 360,
                        duration: const Duration(milliseconds: 300),
                        child: FittedBox(
                          fit: BoxFit.contain,
                          child: RawImage(
                            image: roverService.currentFrame,
                          ),
                        ),
                      ),
                    )
                  : const Text(
                      'No video feed',
                      style: TextStyle(color: Colors.white),
                    ),
            ),
            if (roverService.isConnected)
              Positioned(
                top: 10,
                right: 10,
                child: FloatingActionButton(
                  heroTag: 'rotateCamera',
                  mini: true,
                  backgroundColor: Colors.black.withOpacity(0.5),
                  onPressed: () => roverService.rotateCamera(),
                  child: const Icon(Icons.screen_rotation, color: Colors.white),
                ),
              ),
          ],
        ),
      ),
    );
  }

  Widget _buildControlPanel() {
    final RoverService roverService = Provider.of<RoverService>(context);
    final bool isEnabled = roverService.isConnected;
    
    return Column(
      children: [
        Container(
          width: double.infinity,
          padding: const EdgeInsets.all(8.0),
          color: roverService.isConnected ? Colors.green.shade100 : Colors.grey.shade200,
          child: Text(
            'Status: ${roverService.status}',
            textAlign: TextAlign.center,
          ),
        ),
        
        Padding(
          padding: const EdgeInsets.all(8.0),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  ElevatedButton(
                    onPressed: isEnabled ? () {
                      setState(() => _isForward = true);
                      roverService.sendCommand('forward');
                    } : null,
                    style: ElevatedButton.styleFrom(
                      backgroundColor: _isForward ? Colors.green : null,
                    ),
                    child: const Icon(Icons.arrow_upward),
                  ),
                  const SizedBox(height: 8),
                  Row(
                    children: [
                      ElevatedButton(
                        onPressed: isEnabled ? () {
                          setState(() => _isSteeringLeft = true);
                          roverService.sendCommand('steer:60');
                        } : null,
                        style: ElevatedButton.styleFrom(
                          backgroundColor: _isSteeringLeft ? Colors.green : null,
                        ),
                        child: const Icon(Icons.arrow_back),
                      ),
                      const SizedBox(width: 8),
                      ElevatedButton(
                        onPressed: isEnabled ? () {
                          _stopMovement(roverService);
                        } : null,
                        child: const Icon(Icons.stop),
                      ),
                      const SizedBox(width: 8),
                      ElevatedButton(
                        onPressed: isEnabled ? () {
                          setState(() => _isSteeringRight = true);
                          roverService.sendCommand('steer:120');
                        } : null,
                        style: ElevatedButton.styleFrom(
                          backgroundColor: _isSteeringRight ? Colors.green : null,
                        ),
                        child: const Icon(Icons.arrow_forward),
                      ),
                    ],
                  ),
                  const SizedBox(height: 8),
                  ElevatedButton(
                    onPressed: isEnabled ? () {
                      setState(() => _isBackward = true);
                      roverService.sendCommand('backward');
                    } : null,
                    style: ElevatedButton.styleFrom(
                      backgroundColor: _isBackward ? Colors.green : null,
                    ),
                    child: const Icon(Icons.arrow_downward),
                  ),
                ],
              ),
              
              Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  ElevatedButton(
                    onPressed: isEnabled ? _toggleLights : null,
                    style: ElevatedButton.styleFrom(
                      backgroundColor: _lightsOn ? Colors.yellow : null,
                      padding: const EdgeInsets.all(12),
                    ),
                    child: Icon(
                      _lightsOn ? Icons.lightbulb : Icons.lightbulb_outline,
                    ),
                  ),
                  const SizedBox(height: 10),
                  ElevatedButton(
                    onPressed: isEnabled ? () {
                      roverService.sendCommand('drift');
                    } : null,
                    style: ElevatedButton.styleFrom(
                      padding: const EdgeInsets.all(12),
                    ),
                    child: const Text('Drift 1'),
                  ),
                  const SizedBox(height: 10),
                  ElevatedButton(
                    onPressed: isEnabled ? () {
                      roverService.sendCommand('drift1');
                    } : null,
                    style: ElevatedButton.styleFrom(
                      padding: const EdgeInsets.all(12),
                    ),
                    child: const Text('Drift 2'),
                  ),
                ],
              ),
              
              SizedBox(
                width: 150,
                height: 150,
                child: Opacity(
                  opacity: isEnabled ? 0.8 : 0.4,
                  child: Joystick(
                    listener: (details) {
                      _handleJoystickMove(details);
                    },
                    onStickDragEnd: _handleJoystickEnd,
                    mode: JoystickMode.all,
                    period: const Duration(milliseconds: 100),
                  ),
                ),
              ),
            ],
          ),
        ),
        
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 16.0, vertical: 8.0),
          child: Row(
            children: [
              const Text('Steering:'),
              const SizedBox(width: 8),
              Expanded(
                child: Slider(
                  value: _steeringAngle.toDouble(),
                  min: 30,
                  max: 150,
                  divisions: 120,
                  onChanged: isEnabled ? (double value) {
                    final int angle = value.round();
                    setState(() {
                      _steeringAngle = angle;
                      _isSteeringLeft = angle < 90;
                      _isSteeringRight = angle > 90;
                    });
                    roverService.sendCommand('steer:$angle');
                  } : null,
                ),
              ),
              SizedBox(
                width: 40,
                child: Text('$_steeringAngle°', textAlign: TextAlign.right),
              ),
            ],
          ),
        ),
      ],
    );
  }

  @override
  Widget build(BuildContext context) {
    return KeyboardVisibilityBuilder(
      builder: (context, isKeyboardVisible) {
        return RawKeyboardListener(
          focusNode: _keyboardFocusNode,
          autofocus: true,
          onKey: _handleKeyEvent,
          child: Scaffold(
            appBar: AppBar(
              title: const Text('Rover32 Controller'),
              backgroundColor: Colors.blue[700],
            ),
            body: Column(
              children: [
                _buildConnectionPanel(),
                _buildVideoFeed(),
                if (!isKeyboardVisible) _buildControlPanel(),
              ],
            ),
          ),
        );
      },
    );
  }
}