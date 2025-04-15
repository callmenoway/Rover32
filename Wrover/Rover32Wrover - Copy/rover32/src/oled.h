#ifndef OLED_H
#define OLED_H

#include <Wire.h>
#include <Adafruit_GFX.h>
#include <Adafruit_SSD1306.h>
#include "config.h"

// Function declarations for OLED display control
extern Adafruit_SSD1306 display;

void setupOLED();
void displayText(const String &text);
void displayBigText(const String &text);
void displayIP(const String &text);
void displayMotorAnimation();
void displayGif(const uint8_t *gifData, size_t gifSize);

#endif // OLED_H