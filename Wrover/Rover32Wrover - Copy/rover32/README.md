# Rover32 Project

## Overview
The Rover32 project is designed for controlling a rover equipped with a camera, motors, and an OLED display. It utilizes WebSockets for real-time communication and supports GIF animations on the OLED screen.

## Features
- **Camera Integration**: Captures frames and streams them over WebSocket.
- **Motor Control**: Controls the rover's movement with various commands.
- **OLED Display**: Displays text, animations, and GIFs.
- **WebSocket Communication**: Manages real-time control and camera streaming.

## Project Structure
```
rover32
├── src
│   ├── main.cpp          # Entry point of the application
│   ├── config.h         # Configuration constants and declarations
│   ├── config.cpp       # Implementation of configuration settings
│   ├── oled.h           # OLED display functions declaration
│   ├── oled.cpp         # OLED display functions implementation
│   ├── gif_player.h     # GIF player functions declaration
│   ├── gif_player.cpp   # GIF player functions implementation
│   ├── animation_data.h  # Data structures for GIF frames
│   ├── websocket.h      # WebSocket functions declaration
│   ├── websocket.cpp    # WebSocket functions implementation
│   ├── camera.h         # Camera functions declaration
│   ├── camera.cpp       # Camera functions implementation
│   ├── motors.h         # Motor control functions declaration
│   ├── motors.cpp       # Motor control functions implementation
│   ├── lights.h         # Light control functions declaration
│   └── lights.cpp       # Light control functions implementation
├── platformio.ini       # PlatformIO configuration file
└── README.md            # Project documentation
```

## Setup Instructions
1. **Clone the Repository**: 
   ```bash
   git clone <repository-url>
   cd rover32
   ```

2. **Install Dependencies**: 
   Ensure you have PlatformIO installed. Open the project in PlatformIO and install the required libraries.

3. **Configure Wi-Fi Credentials**: 
   Edit `src/config.cpp` to set your Wi-Fi SSID and password.

4. **Build and Upload**: 
   Use PlatformIO to build and upload the firmware to your ESP32 device.

5. **Open Serial Monitor**: 
   After uploading, open the serial monitor to view the connection status and IP address.

## Usage
- Connect to the rover's WebSocket server using the provided IP address.
- Send commands to control the rover's movement and lights.
- Stream camera feed and display GIF animations on the OLED.

## License
This project is licensed under the MIT License. See the LICENSE file for more details.