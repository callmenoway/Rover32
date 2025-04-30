#include "esp_camera.h"
#include <WiFi.h>
#include <AsyncTCP.h>
#include <ESPAsyncWebServer.h>
#include <ESP32Servo.h>  // Use the ESP32-compatible servo library

// ------------------ Camera Pin Definitions for ESP WROVER KIT ------------------
#define PWDN_GPIO_NUM -1   // Not used
#define RESET_GPIO_NUM -1  // Not used
#define XCLK_GPIO_NUM 21
#define SIOD_GPIO_NUM 26
#define SIOC_GPIO_NUM 27
#define Y9_GPIO_NUM 35
#define Y8_GPIO_NUM 34
#define Y7_GPIO_NUM 39
#define Y6_GPIO_NUM 36
#define Y5_GPIO_NUM 19
#define Y4_GPIO_NUM 18
#define Y3_GPIO_NUM 5
#define Y2_GPIO_NUM 4
#define VSYNC_GPIO_NUM 25
#define HREF_GPIO_NUM 23
#define PCLK_GPIO_NUM 22

// ------------------ Wi-Fi Settings ------------------
const char *sta_ssid = "9asasd";
const char *sta_password = "Luasdasdad";


// ---------------- Motor and Servo Pin Definitions ----------------
// Left motor (L298N)
const int LEFT_IN1 = 25;
const int LEFT_IN2 = 26;
const int LEFT_EN = 33;
// Right motor (L298N)
const int RIGHT_IN1 = 27;
const int RIGHT_IN2 = 14;
const int RIGHT_EN = 12;
// Steering servo
const int SERVO_PIN = 13;

// ---------------- Lights Config ----------------
const int headlights[] = { 2 };
const int taillights[] = { 15 };
const int otherLights[] = {};

// ---------------- Global Objects ------------------
AsyncWebServer serverCam(80);
AsyncWebSocket wsCam("/wsCam");
AsyncWebServer serverControl(81);
AsyncWebSocket wsControl("/wsControl");
Servo steeringServo;
camera_config_t camera_config;

// ---------------- WebSocket Event Handlers ----------------
void onCamWsEvent(AsyncWebSocket *server, AsyncWebSocketClient *client,
                  AwsEventType type, void *arg, uint8_t *data, size_t len) {
  if (type == WS_EVT_CONNECT)
    Serial.printf("[Camera WS] Client #%u connected\n", client->id());
  else if (type == WS_EVT_DISCONNECT)
    Serial.printf("[Camera WS] Client #%u disconnected\n", client->id());
}

void onControlWsEvent(AsyncWebSocket *server, AsyncWebSocketClient *client,
                      AwsEventType type, void *arg, uint8_t *data, size_t len) {
  if (type == WS_EVT_CONNECT)
    Serial.printf("[Control WS] Client #%u connected\n", client->id());
  else if (type == WS_EVT_DISCONNECT)
    Serial.printf("[Control WS] Client #%u disconnected\n", client->id());
  else if (type == WS_EVT_DATA) {
    String msg = "";
    for (size_t i = 0; i < len; i++) {
      msg += (char)data[i];
    }
    Serial.printf("[Control WS] Received: %s\n", msg.c_str());
    if (msg.equalsIgnoreCase("go")) {
      analogWrite(LEFT_EN, 255);
      analogWrite(RIGHT_EN, 255);
      analogWrite(LEFT_IN1, 0);
      // digitalWrite(LEFT_IN1, LOW);
      analogWrite(LEFT_IN2, 255);
      // digitalWrite(LEFT_IN2, HIGH);
      analogWrite(RIGHT_IN1, 255);
      // digitalWrite(RIGHT_IN1, HIGH);
      analogWrite(RIGHT_IN2, 0);
      // digitalWrite(RIGHT_IN2, LOW);
      Serial.println("Motors moving forward");
     } else if (msg.equalsIgnoreCase("goSlow")) {
      analogWrite(LEFT_EN, 255);
      analogWrite(RIGHT_EN, 255);
      analogWrite(LEFT_IN1, 0);
      // digitalWrite(LEFT_IN1, LOW);
      analogWrite(LEFT_IN2, 100);
      // digitalWrite(LEFT_IN2, HIGH);
      analogWrite(RIGHT_IN1, 100);
      // digitalWrite(RIGHT_IN1, LOW);
      analogWrite(RIGHT_IN2, 0);
      // digitalWrite(RIGHT_IN2, HIGH);
      Serial.println("Motors moving backward");
    } else if (msg.equalsIgnoreCase("back")) {
      analogWrite(LEFT_EN, 255);
      analogWrite(RIGHT_EN, 255);
      analogWrite(LEFT_IN1, 150);
      // digitalWrite(LEFT_IN1, LOW);
      analogWrite(LEFT_IN2, 0);
      // digitalWrite(LEFT_IN2, HIGH);
      analogWrite(RIGHT_IN1, 0);
      // digitalWrite(RIGHT_IN1, LOW);
      analogWrite(RIGHT_IN2, 150);
      // digitalWrite(RIGHT_IN2, HIGH);
      Serial.println("Motors moving backward");
    } else if (msg.equalsIgnoreCase("stop")) {
      analogWrite(LEFT_EN, 0);
      analogWrite(RIGHT_EN, 0);
      digitalWrite(LEFT_EN, LOW);
      digitalWrite(RIGHT_IN1, LOW);
      digitalWrite(RIGHT_IN2, LOW);
      digitalWrite(RIGHT_EN, LOW);
      Serial.println("Motors stopping");
    }  else if (msg.equalsIgnoreCase("drift")) {
      analogWrite(LEFT_EN, 255);
      analogWrite(RIGHT_EN, 255);
      analogWrite(LEFT_IN1, 255);
      // digitalWrite(LEFT_IN1, LOW);
      analogWrite(LEFT_IN2, 0);
      // digitalWrite(LEFT_IN2, HIGH);
      analogWrite(RIGHT_IN1, 255);
      // digitalWrite(RIGHT_IN1, LOW);
      analogWrite(RIGHT_IN2, 0);
      // digitalWrite(RIGHT_IN2, HIGH);
      Serial.println("Motors moving backward");
    }else if (msg.equalsIgnoreCase("drift1")) {
      analogWrite(LEFT_EN, 255);
      analogWrite(RIGHT_EN, 255);
      analogWrite(LEFT_IN1, 0);
      // digitalWrite(LEFT_IN1, LOW);
      analogWrite(LEFT_IN2, 255);
      // digitalWrite(LEFT_IN2, HIGH);
      analogWrite(RIGHT_IN1, 0);
      // digitalWrite(RIGHT_IN1, LOW);
      analogWrite(RIGHT_IN2, 255);
      // digitalWrite(RIGHT_IN2, HIGH);
      Serial.println("Motors moving backward");

    } else if (msg.equalsIgnoreCase("onHeadlights")) {
      onHeadLights();
    } else if (msg.equalsIgnoreCase("offHeadlights")) {
      offHeadLights();
    } else if (msg.startsWith("steer:")) {
      int angle = msg.substring(6).toInt();
      angle = constrain(angle, 30, 130);
      steeringServo.write(angle);
      Serial.printf("Steering angle set to %d\n", angle);
    } else
      Serial.printf("Unknown command: %s\n", msg.c_str());
  }
}

void notifyCameraClients(const uint8_t *data, size_t len) {
  wsCam.binaryAll((uint8_t *)data, len);
}

// ---------------- Camera Configuration ----------------
void setupCamera() {
  Serial.println("Starting camera configuration...");
  camera_config.ledc_channel = LEDC_CHANNEL_0;
  camera_config.ledc_timer = LEDC_TIMER_0;

  camera_config.pin_pwdn = PWDN_GPIO_NUM;
  camera_config.pin_reset = RESET_GPIO_NUM;
  camera_config.pin_xclk = XCLK_GPIO_NUM;
  camera_config.pin_sccb_sda = SIOD_GPIO_NUM;
  camera_config.pin_sccb_scl = SIOC_GPIO_NUM;

  camera_config.pin_d0 = Y2_GPIO_NUM;
  camera_config.pin_d1 = Y3_GPIO_NUM;
  camera_config.pin_d2 = Y4_GPIO_NUM;
  camera_config.pin_d3 = Y5_GPIO_NUM;
  camera_config.pin_d4 = Y6_GPIO_NUM;
  camera_config.pin_d5 = Y7_GPIO_NUM;
  camera_config.pin_d6 = Y8_GPIO_NUM;
  camera_config.pin_d7 = Y9_GPIO_NUM;

  camera_config.pin_vsync = VSYNC_GPIO_NUM;
  camera_config.pin_href = HREF_GPIO_NUM;
  camera_config.pin_pclk = PCLK_GPIO_NUM;

  camera_config.xclk_freq_hz = 20000000;
  camera_config.pixel_format = PIXFORMAT_JPEG;

  // For troubleshooting, use a lower resolution:
  camera_config.frame_size = FRAMESIZE_QQVGA;
  camera_config.jpeg_quality = 12;
  camera_config.fb_count = 1;

  esp_err_t err = esp_camera_init(&camera_config);
  if (err != ESP_OK) {
    Serial.printf("Camera init failed with error 0x%x\n", err);
    return;
  }
  Serial.println("Camera init succeeded.");
}

void setupWiFi() {
  do {
    Serial.print("Connecting to local WiFi");
    WiFi.mode(WIFI_STA);
    WiFi.begin(sta_ssid, sta_password);
    unsigned long startTime = millis();
    while (WiFi.status() != WL_CONNECTED && millis() - startTime < 10000) {
      digitalWrite(taillights[0], HIGH);
      delay(500);
      Serial.print(".");
      digitalWrite(taillights[0], LOW);
    }
    if (WiFi.status() == WL_CONNECTED) {
      Serial.println("\nConnected to local WiFi network");
      blinkTailLights();
      Serial.print("Local IP: ");
      Serial.println(WiFi.localIP());
      WiFi.softAPdisconnect(true);
    } else {
      Serial.println("Failed to connect within 10 seconds");
      delay(2000);
    }
  } while (WiFi.status() != WL_CONNECTED);
}

void blinkTailLights() {
  for (int j = 0; j < 5; j++) {
    for (int i = 0; i < sizeof(taillights); i++) {
      digitalWrite(taillights[i], HIGH);
    }
    delay(500);
    for (int i = 0; i < sizeof(taillights); i++) {
      digitalWrite(taillights[i], LOW);
    }
  }
}

void onTailLights() {
  for (int i = 0; i < sizeof(taillights); i++) {
    digitalWrite(taillights[i], HIGH);
  }
}

void offTailLights() {
  for (int i = 0; i < sizeof(taillights); i++) {
    digitalWrite(taillights[i], LOW);
  }
}

void onHeadLights() {
  for (int i = 0; i < sizeof(headlights); i++) {
    digitalWrite(headlights[i], HIGH);
  }
}

void offHeadLights() {
  for (int i = 0; i < sizeof(headlights); i++) {
    digitalWrite(headlights[i], LOW);
  }
}

// ---------------- Setup ----------------
void setup() {
  Serial.begin(115200);
  Serial.println("Starting rover32");

  // Initialize motor pins
  pinMode(LEFT_IN1, OUTPUT);
  pinMode(LEFT_IN2, OUTPUT);
  pinMode(LEFT_EN, OUTPUT);
  pinMode(RIGHT_IN1, OUTPUT);
  pinMode(RIGHT_IN2, OUTPUT);
  pinMode(RIGHT_EN, OUTPUT);

  digitalWrite(LEFT_IN1, LOW);
  digitalWrite(LEFT_IN2, LOW);
  digitalWrite(LEFT_EN, LOW);
  digitalWrite(RIGHT_IN1, LOW);
  digitalWrite(RIGHT_IN2, LOW);
  digitalWrite(RIGHT_EN, LOW);

  // Initialize the servo
  steeringServo.attach(SERVO_PIN);
  steeringServo.write(90);

  // Initialize light pins
  for (int i = 0; i < sizeof(headlights); i++) {
    pinMode(headlights[i], OUTPUT);
  }
  for (int i = 0; i < sizeof(taillights); i++) {
    pinMode(taillights[i], OUTPUT);
  }
  for (int i = 0; i < sizeof(otherLights); i++) {
    pinMode(otherLights[i], OUTPUT);
  }

  // Initialize the camera
  setupCamera();

  // Set up Wi-Fi Connection
  setupWiFi();
  onTailLights();
  
  // Set up WebSocket handlers
  wsCam.onEvent(onCamWsEvent);
  serverCam.addHandler(&wsCam);

  wsControl.onEvent(onControlWsEvent);
  serverControl.addHandler(&wsControl);

  // Start the web servers
  serverCam.begin();
  serverControl.begin();
  
  Serial.println("WebSocket servers started");
  Serial.printf("Camera WebSocket: ws://%s/wsCam\n", WiFi.localIP().toString().c_str());
  Serial.printf("Control WebSocket: ws://%s:81/wsControl\n", WiFi.localIP().toString().c_str());
}

unsigned long lastFrameTime = 0;
const unsigned long frameInterval = 200;

void loop() {
  if (millis() - lastFrameTime > frameInterval) {
    lastFrameTime = millis();
    camera_fb_t *fb = esp_camera_fb_get();
    if (fb) {
      if (fb->format == PIXFORMAT_JPEG) {
        notifyCameraClients(fb->buf, fb->len);
      } else {
        Serial.println("Camera frame format is not JPEG");
      }
      esp_camera_fb_return(fb);
    } else {
      Serial.print(" ");
    }
    delay(1);
  }
}