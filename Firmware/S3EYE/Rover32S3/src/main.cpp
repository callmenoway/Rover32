#include <Arduino.h>
#include <Wire.h>
#include <WiFi.h>
#include "esp_camera.h"
#include "config.h"
#include "oled.h"
#include "camera.h"
#include "tcpserver.h"
#include "motors.h"
#include "lights.h"

// Task handles
TaskHandle_t cameraTaskHandle = NULL;
TaskHandle_t tcpTaskHandle = NULL;

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

void cameraTask(void *parameter)
{
  while (true)
  {
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
      releaseFrame(fb);
    }
    vTaskDelay(10 / portTICK_PERIOD_MS); // Small delay to yield CPU
  }
}

void tcpTask(void *parameter)
{
  while (true)
  {
    handleTcpConnections();
    vTaskDelay(10 / portTICK_PERIOD_MS); // Small delay to yield CPU
  }
}
void monitorWiFiSignal() {
  int rssi = WiFi.RSSI();
  Serial.printf("Wi-Fi Signal Strength: %d dBm\n", rssi);
}
void setup()
{
  Serial.begin(115200);
  Serial.println("Starting rover32");
  setArgbLight(255, 0, 0); // Start with red light
  
  // Initialize the I2C for OLED
  Wire.begin(OLED_SDA, OLED_SCL);

  // Initialize the OLED display
  setupOLED();
  displayText("Rover32\nInitializing\nPSRAM...");
  setArgbLight(255, 40, 0); // Reddish-orange
  
  // Initialize PSRAM
  if (psramInit())
  {
    Serial.println("PSRAM initialized");
    displayText("Rover32\nPSRAM: OK\nInitializing\nMotors...");
  }
  else
  {
    Serial.println("PSRAM initialization failed");
    displayText("Rover32\nPSRAM: !!NONE!!\nInitializing\nMotors...");
  }
  setArgbLight(255, 80, 0); // Orange

  // Initialize motors
  setupMotors();
  displayText("Rover32\nMotors Ready\nInitializing\nLights...");
  setArgbLight(255, 130, 0); // Yellow-orange

  // Initialize lights
  setupLights();
  setArgbLight(200, 180, 0); // Yellow-green

  displayText("Rover32\nInitializing\nCamera...");
  delay(100);

  // Initialize the camera
  setupCamera();
  delay(200);
  setArgbLight(150, 210, 0); // Yellow-green to green

  // Refresh OLED bus after camera setup which might interfere with I2C
  Wire.begin(OLED_SDA, OLED_SCL);

  if (psramFound())
  {
    displayText("Rover32\nCamera Ready\nPSRAM: OK");
  }
  else
  {
    displayText("Rover32\nCamera Ready\nPSRAM: !!NONE!!");
  }
  setArgbLight(100, 230, 0); // More green
  delay(100);

  // Set up Wi-Fi Connection
  displayText("Rover32\nInitializing\nWi-Fi Connecting...\n");
  setupWiFi();
  displayIP("Wi-Fi ready");
  onTailLights();
  setArgbLight(50, 250, 0); // Almost green

  // Set up TCP servers
  setupTcpServers();

  Serial.printf("Camera TCP server: %s:%d\n", WiFi.localIP().toString().c_str(), CAM_PORT);
  Serial.printf("Control TCP server: %s:%d\n", WiFi.localIP().toString().c_str(), CONTROL_PORT);
  
  // Fully green when everything is initialized
  setArgbLight(0, 255, 0);
  delay(1000);
  setArgbLight(0, 0, 255);


  // Create tasks for camera and TCP handling
  xTaskCreatePinnedToCore(cameraTask, "Camera Task", 8192, NULL, 2, &cameraTaskHandle, 0); // Priority 2
  xTaskCreatePinnedToCore(tcpTask, "TCP Task", 4096, NULL, 1, &tcpTaskHandle, 1);         // Priority 1;
}


void loop() {
  monitorWiFiSignal();
  delay(5000); // Check every 5 seconds
}