#include "oled.h"
#include <Arduino.h>
#include "gif_player.h"

// Global display object declaration
Adafruit_SSD1306 display(SCREEN_WIDTH, SCREEN_HEIGHT, &Wire, OLED_RESET);

void setupOLED()
{
  display.begin(SSD1306_SWITCHCAPVCC, SCREEN_ADDRESS);
  display.setRotation(0); // Set rotation to 0 degrees
  display.clearDisplay();
  display.setTextSize(1);
  display.setTextColor(SSD1306_WHITE);
  display.setCursor(0, 0);
  display.print("Rover32...");
  display.display();
  Serial.println("OLED initialized");
}

void displayText(const String &text)
{
  display.clearDisplay();
  display.setTextSize(1);
  display.setTextColor(SSD1306_WHITE);

  int startPos = 0;
  int lineHeight = 8; // Height of text line at size 1
  int currentLine = 0;

  while (startPos < text.length())
  {
    int endPos = text.indexOf('\n', startPos);
    if (endPos == -1)
      endPos = text.length();

    String line = text.substring(startPos, endPos);
    display.setCursor(0, currentLine * lineHeight);
    display.print(line);
    startPos = endPos + 1;
    currentLine++;

    if (currentLine * lineHeight >= SCREEN_HEIGHT)
      break;
  }

  display.display();
}

void displayBigText(const String &text)
{
  display.clearDisplay();
  display.setTextSize(2);
  display.setTextColor(SSD1306_WHITE);

  int16_t x1, y1;
  uint16_t textWidth, textHeight;
  display.getTextBounds(text, 0, 0, &x1, &y1, &textWidth, &textHeight);
  display.setCursor((SCREEN_WIDTH - textWidth) / 2, (SCREEN_HEIGHT - textHeight) / 2);
  display.print(text);
  display.display();
}

void displayIP(const String &text)
{
  display.clearDisplay();
  display.setTextSize(1);
  display.setTextColor(SSD1306_WHITE);
  display.setCursor(0, 0);
  display.print("Rover32");
  display.setCursor(0, 8);
  display.print(text);
  display.setCursor(0, 16);
  display.print(sta_ssid);
  display.setCursor(0, 24);
  display.print(WiFi.localIP().toString());
  display.display();
}

void displayMotorAnimation()
{
  display.clearDisplay();
  display.setTextSize(2);
  display.setTextColor(SSD1306_WHITE);
  display.setCursor(0, 8);
  display.print("Rover32");

  static int frame = 0;
  const int centerX = 110;
  const int centerY = 16;
  const int radius = 10;

  display.drawCircle(centerX, centerY, radius, SSD1306_WHITE);

  switch (frame % 4)
  {
  case 0:
    display.drawLine(centerX, centerY - radius, centerX, centerY + radius, SSD1306_WHITE);
    display.drawLine(centerX - radius, centerY, centerX + radius, centerY, SSD1306_WHITE);
    break;
  case 1:
    display.drawLine(centerX - radius * 0.7, centerY - radius * 0.7,
                     centerX + radius * 0.7, centerY + radius * 0.7, SSD1306_WHITE);
    display.drawLine(centerX - radius * 0.7, centerY + radius * 0.7,
                     centerX + radius * 0.7, centerY - radius * 0.7, SSD1306_WHITE);
    break;
  case 2:
    display.drawLine(centerX, centerY - radius, centerX, centerY + radius, SSD1306_WHITE);
    display.drawLine(centerX - radius, centerY, centerX + radius, centerY, SSD1306_WHITE);
    break;
  case 3:
    display.drawLine(centerX - radius * 0.7, centerY - radius * 0.7,
                     centerX + radius * 0.7, centerY + radius * 0.7, SSD1306_WHITE);
    display.drawLine(centerX - radius * 0.7, centerY + radius * 0.7,
                     centerX + radius * 0.7, centerY - radius * 0.7, SSD1306_WHITE);
    break;
  }

  frame++;
  display.display();
}

void playGif(const uint8_t* gifData, size_t gifSize) {
  // Assuming gifData contains the GIF frames and gifSize is the size of the data
  // This function should handle the logic to decode and display the GIF frames
  // You would typically use a library to handle GIF decoding
  // For now, this is a placeholder function
  Serial.println("Playing GIF...");
  // Implement GIF playing logic here
}