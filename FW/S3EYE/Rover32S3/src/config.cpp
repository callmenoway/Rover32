#include "config.h"

// -------- WiFi Credentials --------
// const char *sta_ssid = "90:45:47";       // Your Wi-Fi SSID
// const char *sta_password = "Luc41312!";  // Your Wi-Fi password
const char *sta_ssid = "H2O-Fi";       // Your Wi-Fi SSID
const char *sta_password = "10Lauretta!";  // Your Wi-Fi password



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
const int HEADLIGHTS_COUNT = 1; // Only pin count
const int headlights[] = {0};
const int TAILLIGHTS_COUNT = 1; // Only pin count 
const int taillights[] = {45};
const int ARGBlight = 48;
const int stoplight = 47;  // -1 to disable

// --------- OLED Settings ---------
const int OLED_SDA = 43;
const int OLED_SCL = 44;