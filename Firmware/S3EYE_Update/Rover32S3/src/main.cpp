#include <Arduino.h>
#include <Wire.h>
#include <WiFi.h>
#include <Preferences.h>
#include "esp_camera.h"
#include "config.h"
#include "oled.h"
#include "camera.h"
#include "tcpserver.h"
#include "motors.h"
#include "lights.h"
#include "webportal.h" // This contains the loadWiFiCredentials declaration

// Task handles
TaskHandle_t cameraTaskHandle = NULL;
TaskHandle_t tcpTaskHandle = NULL;
TaskHandle_t webPortalTaskHandle = NULL;

void setupWiFi()
{
  // Try to load saved credentials from EEPROM
  String savedSsid = "";
  String savedPassword = "";
  // Call the function implemented in webportal.cpp
  loadWiFiCredentials(savedSsid, savedPassword);
  
  // If there are saved credentials, use them
  if (savedSsid.length() > 0) {
    sta_ssid = strdup(savedSsid.c_str());
    sta_password = strdup(savedPassword.c_str());
    Serial.printf("Using saved WiFi credentials: %s\n", sta_ssid);
  }
  
  int connectionAttempts = 0;
  bool connected = false;
  
  // Try to connect to WiFi with the current or saved credentials
  while (!connected && connectionAttempts < MAX_CONNECTION_ATTEMPTS) {
    connectionAttempts++;
    Serial.printf("WiFi connection attempt %d of %d\n", connectionAttempts, MAX_CONNECTION_ATTEMPTS);
    
    displayText("Rover32\nConnecting to Wi-Fi:\n" + String(sta_ssid) + "\nAttempt " + String(connectionAttempts));
    
    WiFi.mode(WIFI_STA);
    WiFi.begin(sta_ssid, sta_password);
    
    unsigned long startTime = millis();
    // Blink the tail light while trying to connect
    while (WiFi.status() != WL_CONNECTED && millis() - startTime < CONNECTION_TIMEOUT) {
      digitalWrite(taillights[0], HIGH);
      delay(250);
      digitalWrite(taillights[0], LOW);
      delay(250);
      Serial.print(".");
    }
    
    if (WiFi.status() == WL_CONNECTED) {
      connected = true;
      Serial.println("\nConnected to WiFi network!");
      Serial.print("Local IP: ");
      Serial.println(WiFi.localIP());
      
      // Indicate successful connection
      blinkTailLights();
      displayIP("Wi-Fi Connected!");
      
      // Turn off any existing AP
      WiFi.softAPdisconnect(true);
    } else {
      Serial.println("Failed to connect to WiFi");
      setArgbLight(255, 0, 0); // Red light to indicate failure
      delay(1000);
    }
  }
  
  // If we couldn't connect after all attempts, set up AP mode with web portal
  if (!connected) {
    Serial.println("Maximum connection attempts reached. Setting up AP mode...");
    // Turn off station mode
    WiFi.disconnect();
    
    // Setup the web portal in AP mode
    setupWebPortal();
  }
}

// Task to handle web portal interactions
void webPortalTask(void *parameter)
{
  while (true) {
    if (apModeActive) {
      handleWebPortal();
      
      // If new WiFi credentials have been set, try to connect again
      if (WiFi.status() == WL_CONNECTED) {
        Serial.println("Connected to new WiFi. Stopping AP mode.");
        
        // Clean up AP mode
        server.stop();
        dnsServer.stop();
        WiFi.softAPdisconnect(true);
        apModeActive = false;
        
        // Display the new connection info
        displayIP("Wi-Fi Connected!");
        setArgbLight(0, 255, 0); // Green light to indicate success
      }
    }
    vTaskDelay(10 / portTICK_PERIOD_MS);
  }
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
  
  // Only set up TCP servers if we're connected to WiFi
  if (WiFi.status() == WL_CONNECTED) {
    // Set up TCP servers
    setupTcpServers();
    Serial.printf("Camera TCP server: %s:%d\n", WiFi.localIP().toString().c_str(), CAM_PORT);
    Serial.printf("Control TCP server: %s:%d\n", WiFi.localIP().toString().c_str(), CONTROL_PORT);
    setArgbLight(0, 255, 0); // Green for success
  } else {
    // If we're in AP mode, indicate with different color
    setArgbLight(0, 0, 255); // Blue for AP mode
  }
  
  delay(1000);

  // Create tasks
  xTaskCreatePinnedToCore(cameraTask, "Camera Task", 8192, NULL, 2, &cameraTaskHandle, 0);
  xTaskCreatePinnedToCore(tcpTask, "TCP Task", 4096, NULL, 1, &tcpTaskHandle, 1);
  
  // Create a task for the web portal if in AP mode
  if (apModeActive) {
    xTaskCreatePinnedToCore(webPortalTask, "Web Portal Task", 4096, NULL, 1, &webPortalTaskHandle, 1);
  }
}

void loop() {
  // Monitor WiFi signal if connected
  if (WiFi.status() == WL_CONNECTED) {
    monitorWiFiSignal();
  }
  
  // If we're in AP mode but somehow connected to WiFi, update status
  if (apModeActive && WiFi.status() == WL_CONNECTED) {
    Serial.println("WiFi connected while in AP mode - switching to station mode");
    displayIP("Wi-Fi Connected!");
    setArgbLight(0, 255, 0);
    
    // Set up TCP servers now that we have WiFi
    setupTcpServers();
  }
  
  delay(5000); // Check every 5 seconds
}