#include "config.h"

// -------- WiFi Credentials --------
const char *sta_ssid = "90:45:47";       // Your Wi-Fi SSID
const char *sta_password = "Luc41312!";  // Your Wi-Fi password

// -------- Motor and Servo Pin Definitions --------
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

// --------- Lights Config ---------
const int HEADLIGHTS_COUNT = 1; // Only pin count
const int headlights[] = {2};
const int TAILLIGHTS_COUNT = 1; // Only pin count 
const int taillights[] = {15};
const int stoplight = 0;  // -1 to disable

// --------- OLED Settings ---------
const int OLED_SDA = 3;
const int OLED_SCL = 1;