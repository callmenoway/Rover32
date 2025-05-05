#include <Arduino.h>
#include <Wire.h>
#include <WiFi.h>
#include "esp_camera.h"
#include "config.h"
#include "oled.h"
#include "camera.h"
#include "tcpserver.h"  // Use TCP instead of WebSockets
#include "motors.h"
#include "lights.h"

void setupWiFi()
{
  do
  {
    Serial.print("Connecting to local WiFi");
    WiFi.mode(WIFI_STA);
    WiFi.begin(sta_ssid, sta_password);
    unsigned long startTime = millis();
    while (WiFi.status() != WL_CONNECTED && millis() - startTime < 10000)
    {
      digitalWrite(taillights[0], HIGH);
      delay(500);
      Serial.print(".");
      digitalWrite(taillights[0], LOW);
    }
    if (WiFi.status() == WL_CONNECTED)
    {
      Serial.println("\nConnected to local WiFi network");
      blinkTailLights();
      Serial.print("Local IP: ");
      Serial.println(WiFi.localIP());
      WiFi.softAPdisconnect(true);
    }
    else
    {
      Serial.println("Failed to connect within 10 seconds");
      delay(2000);
    }
  } while (WiFi.status() != WL_CONNECTED);
}

// ---------------- Setup ----------------
void setup()
{
  Serial.begin(115200);
  Serial.println("Starting rover32");
    // Initialize the I2C for OLED
    Wire.begin(OLED_SDA, OLED_SCL);
  
    // Initialize the OLED display
    setupOLED();
  displayText("Rover32\nInitializing\nPSRAM...");

  // Initialize PSRAM
  if(psramInit()) {
    Serial.println("PSRAM initialized");
    displayText("Rover32\nPSRAM: OK\nInitializing\nMotors...");
  } else {
    Serial.println("PSRAM initialization failed");
    displayText("Rover32\nPSRAM: !!NONE!!\nInitializing\nMotors...");
  }

  // Initialize motors
  setupMotors();
  displayText("Rover32\nMotors Ready\nInitializing\nLights...");

  // Initialize lights
  setupLights();



  displayText("Rover32\nInitializing\nCamera...");
  delay(100);  // Small delay to ensure display updates
  
  // Initialize the camera
  setupCamera();
  delay(200);  // Give time for camera initialization to complete
  
  // Refresh OLED bus after camera setup which might interfere with I2C
  Wire.begin(OLED_SDA, OLED_SCL);
  
  if(psramFound()) {
    displayText("Rover32\nCamera Ready\nPSRAM: OK");
  } else {
    displayText("Rover32\nCamera Ready\nPSRAM: !!NONE!!");
  }
  delay(100);  // Small delay to ensure display updates

  // Set up Wi-Fi Connection
  displayText("Rover32\nInitializing\nWi-Fi Connecting...\n");
  setupWiFi();
  displayIP("Wi-Fi ready");
  onTailLights();

  // Set up TCP servers instead of WebSockets
  setupTcpServers();

  Serial.printf("Camera TCP server: %s:%d\n", WiFi.localIP().toString().c_str(), CAM_PORT);
  Serial.printf("Control TCP server: %s:%d\n", WiFi.localIP().toString().c_str(), CONTROL_PORT);
}
// Camera frame management
unsigned long lastFrameTime = 0;
const unsigned long frameInterval = 200;

void loop()
{
  // Handle TCP connections
  handleTcpConnections();
  
  if (millis() - lastFrameTime > frameInterval)
  {
    lastFrameTime = millis();
    camera_fb_t *fb = captureFrame();
    if (fb)
    {
      if (fb->format == PIXFORMAT_JPEG)
      {
        notifyCameraClients(fb->buf, fb->len);
      }
      else
      {
        Serial.println("Camera frame format is not JPEG");
      }
      esp_camera_fb_return(fb);
      releaseFrame(fb);
    }
    else
    {
      Serial.print(" ");
    }
    // delay(1);
  }
}