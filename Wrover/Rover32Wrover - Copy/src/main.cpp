#include <Arduino.h>
#include <Wire.h>
#include <WiFi.h>
#include "esp_camera.h"
#include "config.h"
#include "oled.h"
#include "camera.h"
#include "websocket.h"
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

  // Initialize motors
  setupMotors();
  
  // Initialize lights
  setupLights();

  // Initialize the I2C for OLED
  Wire.begin(OLED_SDA, OLED_SCL);
  
  // Initialize the OLED display
  setupOLED();

  displayText("Rover32\nInitializing\nCamera...");
  
  // Initialize the camera
  setupCamera();
  displayText("Rover32\nCamera Ready");

  // Set up Wi-Fi Connection
  displayText("Rover32\nInitializing\nWi-Fi Connecting...\n");
  setupWiFi();
  displayIP("Wi-Fi ready");
  onTailLights();

  // Set up WebSockets
  setupWebSockets();

  Serial.printf("Camera WebSocket: ws://%s/wsCam\n", WiFi.localIP().toString().c_str());
  Serial.printf("Control WebSocket: ws://%s/wsControl\n", WiFi.localIP().toString().c_str());
}

// Camera frame management
unsigned long lastFrameTime = 0;
const unsigned long frameInterval = 200;

void loop()
{
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
    }
    else
    {
      Serial.print(" ");
    }
    delay(1);
  }
}