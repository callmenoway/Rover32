#include "tcpserver.h"
#include "oled.h"
#include "motors.h"
#include "lights.h"
#include <Arduino.h>

// TCP servers for camera and control
WiFiServer camServer(CAM_PORT);
WiFiServer controlServer(CONTROL_PORT);

// Client arrays to store connected clients
WiFiClient camClients[MAX_CLIENTS];
WiFiClient controlClients[MAX_CLIENTS];

// Track which client slots are in use
bool camClientConnected[MAX_CLIENTS] = {false};
bool controlClientConnected[MAX_CLIENTS] = {false};

void setupTcpServers() {
  // Start the TCP servers
  camServer.begin();
  controlServer.begin();
  
  // Set connection timeout
  camServer.setNoDelay(true);
  controlServer.setNoDelay(true);
  
  Serial.println("TCP servers started");
  Serial.printf("Camera TCP server: %s:%d\n", WiFi.localIP().toString().c_str(), CAM_PORT);
  Serial.printf("Control TCP server: %s:%d\n", WiFi.localIP().toString().c_str(), CONTROL_PORT);
  
  displayIP("TCP Ready");
}

void handleTcpConnections() {
  // Check for new camera clients
  if (camServer.hasClient()) {
    WiFiClient newClient = camServer.available();
    
    // Find a free slot
    int i;
    for (i = 0; i < MAX_CLIENTS; i++) {
      if (!camClientConnected[i] || !camClients[i].connected()) {
        if (camClientConnected[i]) {
          camClients[i].stop();
        }
        camClients[i] = newClient;
        camClientConnected[i] = true;
        Serial.printf("New camera client connected: %d\n", i);
        break;
      }
    }
    
    // No free slots, reject
    if (i == MAX_CLIENTS) {
      Serial.println("No free camera client slots");
      newClient.stop();
    }
  }
  
  // Check for new control clients
  if (controlServer.hasClient()) {
    WiFiClient newClient = controlServer.available();
    
    // Find a free slot
    int i;
    for (i = 0; i < MAX_CLIENTS; i++) {
      if (!controlClientConnected[i] || !controlClients[i].connected()) {
        if (controlClientConnected[i]) {
          controlClients[i].stop();
        }
        controlClients[i] = newClient;
        controlClientConnected[i] = true;
        Serial.printf("New control client connected: %d\n", i);
        displayBigText("Client Connected");
        digitalWrite(stoplight, HIGH);
        break;
      }
    }
    
    // No free slots, reject
    if (i == MAX_CLIENTS) {
      Serial.println("No free control client slots");
      newClient.stop();
    }
  }
  
  // Handle incoming control commands
  for (int i = 0; i < MAX_CLIENTS; i++) {
    if (controlClientConnected[i] && controlClients[i].connected()) {
      if (controlClients[i].available()) {
        String command = controlClients[i].readStringUntil('\n');
        command.trim();
        
        Serial.printf("Received command: %s\n", command.c_str());
        displayMotorAnimation();
        digitalWrite(stoplight, LOW);
        
        // Process commands - keep the same command structure as in websocket.cpp
        if (command.equalsIgnoreCase("go")) {
          moveForward();
        } else if (command.equalsIgnoreCase("goSlow")) {
          moveForwardSlow();
        } else if (command.equalsIgnoreCase("back")) {
          moveBackward();
        } else if (command.equalsIgnoreCase("stop")) {
          stopMotors();
          displayBigText("Rover32");
          digitalWrite(stoplight, HIGH);
        } else if (command.equalsIgnoreCase("drift")) {
          driftMode1();
        } else if (command.equalsIgnoreCase("drift1")) {
          driftMode2();
        } else if (command.equalsIgnoreCase("onHeadlights")) {
          onHeadLights();
        } else if (command.equalsIgnoreCase("offHeadlights")) {
          offHeadLights();
        } else if (command.startsWith("steer:")) {
          int angle = command.substring(6).toInt();
          setSteeringAngle(angle);
        } else if (command.equalsIgnoreCase("forward")) {
          moveForward();
        } else if (command.equalsIgnoreCase("backward")) {
          moveBackward();
        } else if (command.equalsIgnoreCase("lights_on")) {
          onHeadLights();
        } else if (command.equalsIgnoreCase("lights_off")) {
          offHeadLights();
        } else {
          Serial.printf("Unknown command: %s\n", command.c_str());
        }
      }
    } else if (controlClientConnected[i] && !controlClients[i].connected()) {
      controlClientConnected[i] = false;
      controlClients[i].stop();
      Serial.printf("Control client %d disconnected\n", i);
      
      // Check if there are no more clients connected
      bool anyClientConnected = false;
      for (int j = 0; j < MAX_CLIENTS; j++) {
        if (controlClientConnected[j]) {
          anyClientConnected = true;
          break;
        }
      }
      
      if (!anyClientConnected) {
        // Display IP address on OLED since no clients are connected
        displayIP("No clients connected");
        // Turn on taillights to indicate standby mode
        onTailLights();
        digitalWrite(stoplight, LOW);
      }
    }
  }
  
  // Clean up camera clients that have disconnected
  for (int i = 0; i < MAX_CLIENTS; i++) {
    if (camClientConnected[i] && !camClients[i].connected()) {
      camClientConnected[i] = false;
      camClients[i].stop();
      Serial.printf("Camera client %d disconnected\n", i);
    }
  }
}

void notifyCameraClients(const uint8_t *data, size_t len) {
  // First, prepare JPEG header with size information
  // Format: [SOI marker][length (4 bytes)]
  uint8_t header[6];
  header[0] = 0xFF;  // JPEG SOI marker (Start of Image)
  header[1] = 0xD8;
  // Big-endian 4-byte length value
  header[2] = (len >> 24) & 0xFF;
  header[3] = (len >> 16) & 0xFF;
  header[4] = (len >> 8) & 0xFF;
  header[5] = len & 0xFF;
  
  // Send to all connected camera clients
  for (int i = 0; i < MAX_CLIENTS; i++) {
    if (camClientConnected[i] && camClients[i].connected()) {
      // Send header first
      camClients[i].write(header, 6);
      
      // Send JPEG data
      size_t sent = 0;
      while (sent < len) {
        // Fix: Ensure both arguments to min are the same type (size_t)
        size_t toSend = (len - sent < 1024) ? (len - sent) : 1024;  // Send in chunks of max 1KB
        size_t written = camClients[i].write(data + sent, toSend);
        if (written == 0) {
          Serial.printf("Failed to send data to client %d\n", i);
          break;
        }
        sent += written;
        yield();  // Allow other processes to run
      }
      
      // Flush to ensure immediate delivery
      camClients[i].flush();
    }
  }
}

void sendToControlClients(const char* message) {
  // Send a message to all control clients
  for (int i = 0; i < MAX_CLIENTS; i++) {
    if (controlClientConnected[i] && controlClients[i].connected()) {
      controlClients[i].println(message);
    }
  }
}