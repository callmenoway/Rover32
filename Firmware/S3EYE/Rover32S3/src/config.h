#ifndef CONFIG_H
#define CONFIG_H
// --------- OLED Settings ---------

#define SCREEN_HEIGHT 32 // Change these values to match your OLED display
#define SCREEN_ADDRESS 0x3C // 0x3D for 128x64, 0x3C for 128x32


////////////////////////////////////////////////
// Do Not Touch Neyond Here If you Don't Know //
////////////////////////////////////////////////

extern const int OLED_SDA;
extern const int OLED_SCL;
// Change these values to match your OLED display
#define SCREEN_WIDTH 128 
// DO NOT CHANGE THIS UNLESS YOU KNOW WHAT YOU ARE DOING
#define OLED_RESET -1 // Reset pin # (or -1 if sharing Arduino reset pin)

// ------- Camera Pin Definitions for ESP S3 EYE ---------
#define PWDN_GPIO_NUM -1
#define RESET_GPIO_NUM -1
#define XCLK_GPIO_NUM 15
#define SIOD_GPIO_NUM 4
#define SIOC_GPIO_NUM 5

#define Y2_GPIO_NUM 11
#define Y3_GPIO_NUM 9
#define Y4_GPIO_NUM 8
#define Y5_GPIO_NUM 10
#define Y6_GPIO_NUM 12
#define Y7_GPIO_NUM 18
#define Y8_GPIO_NUM 17
#define Y9_GPIO_NUM 16

#define VSYNC_GPIO_NUM 6
#define HREF_GPIO_NUM 7
#define PCLK_GPIO_NUM 13
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
extern const int ARGBlight;
extern const int stoplight;  // -1 to disable

#endif // CONFIG_H