#ifndef CONFIG_H
#define CONFIG_H

// --------- OLED Settings ---------
#define SCREEN_HEIGHT 32 // Change these values to match your OLED display
#define SCREEN_ADDRESS 0x3C // 0x3D for 128x64, 0x3C for 128x32

////////////////////////////////////////////////
// Do Not Touch Beyond Here If you Don't Know //
////////////////////////////////////////////////

extern const int OLED_SDA;
extern const int OLED_SCL;
// Change these values to match your OLED display
#define SCREEN_WIDTH 128 
// DO NOT CHANGE THIS UNLESS YOU KNOW WHAT YOU ARE DOING
#define OLED_RESET -1 // Reset pin # (or -1 if sharing Arduino reset pin)

// -------- WiFi Credentials --------
extern const char *sta_ssid;         // Your Wi-Fi SSID
extern const char *sta_password;     // Your Wi-Fi password

// -------- Motor and Servo Pin Definitions --------
// Left motor (L298N)
extern const int LEFT_IN1;
extern const int LEFT_IN2;
extern const int LEFT_EN;
// Right motor (L298N)
extern const int RIGHT_IN1;
extern const int RIGHT_IN2;
extern const int RIGHT_EN;
// Steering servo
extern const int SERVO_PIN;

// --------- Lights Config ---------
extern const int HEADLIGHTS_COUNT;
extern const int headlights[];
extern const int TAILLIGHTS_COUNT;
extern const int taillights[];
extern const int stoplight;  // -1 to disable

#endif // CONFIG_H