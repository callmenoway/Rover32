#include "config.h"

// -------- WiFi Credentials --------
// These are now pointers so they can be changed at runtime
const char *sta_ssid = "";       // Your Wi-Fi SSID
const char *sta_password = "";  // Your Wi-Fi password

// -------- Motor and Servo Pin Definitions --------
// Left motor (L298N)
const int LEFT_IN1 = 2; // 2
const int LEFT_IN2 = 42; // 3
const int LEFT_EN = 1; // 1
// Right motor (L298N)
const int RIGHT_IN1 = 41; // 4
const int RIGHT_IN2 = 40;  // 5
const int RIGHT_EN = 39; // 6
// Steering servo
const int SERVO_PIN = 38; // 7

// --------- Lights Config ---------
const int HEADLIGHTS_COUNT = 3; // Only pin count
const int headlights[] = {21,20,19};
const int TAILLIGHTS_COUNT = 1; // Only pin count 
const int taillights[] = {45};
const int ARGBlight = 48;
const int stoplight = 47;  // -1 to disable

// --------- OLED Settings ---------
const int OLED_SDA = 43;
const int OLED_SCL = 44;
