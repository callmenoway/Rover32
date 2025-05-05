import 'dart:async';
import 'dart:io';
import 'dart:typed_data';
import 'dart:ui' as ui;
import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';

class RoverService extends ChangeNotifier {
  Socket? _controlSocket;
  Socket? _cameraSocket;
  
  bool _isConnected = false;
  String _status = 'Disconnected';
  String _ipAddress = '192.168.1.100';
  final int _controlPort = 8001;
  final int _cameraPort = 8000;
  
  ui.Image? _currentFrame;
  final List<int> _imageBuffer = [];
  bool _processingImage = false;
  int _rotationDegrees = 0; // 0, 90, 180, or 270

  // Connection status getters
  bool get isConnected => _isConnected;
  String get status => _status;
  String get ipAddress => _ipAddress;
  ui.Image? get currentFrame => _currentFrame;
  int get rotationDegrees => _rotationDegrees;
  
  // Set IP address
  void setIpAddress(String ip) {
    _ipAddress = ip;
    notifyListeners();
  }

  // Rotate camera view by 90 degrees
  void rotateCamera() {
    _rotationDegrees = (_rotationDegrees + 90) % 360;
    notifyListeners();
    
    if (_isConnected) {
      sendCommand('rotate:${_rotationDegrees}');
    }
  }

  // Connect to the rover
  Future<bool> connect() async {
    if (_isConnected) return true;
    
    try {
      _status = 'Connecting...';
      notifyListeners();
      
      // Connect to control socket
      _controlSocket = await Socket.connect(_ipAddress, _controlPort)
          .timeout(const Duration(seconds: 5));
      
      // Connect to camera socket
      _cameraSocket = await Socket.connect(_ipAddress, _cameraPort)
          .timeout(const Duration(seconds: 5));
      
      // Set up camera stream listener
      _cameraSocket!.listen(_onCameraData, 
        onError: _onSocketError,
        onDone: _onCameraSocketDone,
        cancelOnError: true);
      
      _isConnected = true;
      _status = 'Connected to $_ipAddress';
      notifyListeners();
      return true;
    } catch (e) {
      _status = 'Connection error: ${e.toString()}';
      disconnect();
      notifyListeners();
      return false;
    }
  }
  
  // Disconnect from the rover
  void disconnect() {
    _controlSocket?.destroy();
    _cameraSocket?.destroy();
    
    _controlSocket = null;
    _cameraSocket = null;
    _isConnected = false;
    _status = 'Disconnected';
    _imageBuffer.clear();
    notifyListeners();
  }
  
  // Send command to the rover
  void sendCommand(String command) {
    if (!_isConnected || _controlSocket == null) {
      _status = 'Not connected';
      notifyListeners();
      return;
    }
    
    try {
      _controlSocket!.write('$command\n');
    } catch (e) {
      _status = 'Error sending command: ${e.toString()}';
      disconnect();
      notifyListeners();
    }
  }
  
  // Handle camera data
  void _onCameraData(Uint8List data) {
    _imageBuffer.addAll(data);
    _processImageBuffer();
  }
  
  // Process image buffer
  void _processImageBuffer() {
    if (_processingImage || _imageBuffer.isEmpty) return;
    
    _processingImage = true;
    
    // Find JPEG SOI marker (0xFF 0xD8)
    int startIndex = -1;
    for (int i = 0; i < _imageBuffer.length - 1; i++) {
      if (_imageBuffer[i] == 0xFF && _imageBuffer[i + 1] == 0xD8) {
        startIndex = i;
        break;
      }
    }
    
    if (startIndex >= 0 && _imageBuffer.length >= startIndex + 6) {
      // Extract image size (4 bytes after SOI marker)
      int imageSize = (_imageBuffer[startIndex + 2] << 24) | 
                      (_imageBuffer[startIndex + 3] << 16) | 
                      (_imageBuffer[startIndex + 4] << 8) | 
                      _imageBuffer[startIndex + 5];
                      
      // Check if we have the complete image
      if (_imageBuffer.length >= startIndex + imageSize + 6) {
        // Extract image data (skip 6-byte header)
        List<int> imageData = _imageBuffer.sublist(startIndex + 6, startIndex + imageSize + 6);
        
        // Decode image asynchronously
        _decodeImage(Uint8List.fromList(imageData));
        
        // Remove processed data from buffer
        _imageBuffer.removeRange(0, startIndex + imageSize + 6);
      }
    } else if (startIndex < 0 && _imageBuffer.length > 100) {
      // If no valid JPEG header found after collecting enough data, clear buffer
      _imageBuffer.clear();
    }
    
    _processingImage = false;
    
    // If there's still data in the buffer, process it
    if (_imageBuffer.length > 6) {
      _processImageBuffer();
    }
  }
  
  // Decode image data
  Future<void> _decodeImage(Uint8List data) async {
    try {
      final codec = await ui.instantiateImageCodec(data);
      final frameInfo = await codec.getNextFrame();
      
      _currentFrame = frameInfo.image;
      notifyListeners();
    } catch (e) {
      print('Image decoding error: ${e.toString()}');
    }
  }
  
  // Socket error handler
  void _onSocketError(error) {
    _status = 'Socket error: ${error.toString()}';
    disconnect();
  }
  
  // Camera socket done handler
  void _onCameraSocketDone() {
    if (_isConnected) {
      _status = 'Camera connection closed';
      disconnect();
    }
  }
  
  @override
  void dispose() {
    disconnect();
    super.dispose();
  }
}