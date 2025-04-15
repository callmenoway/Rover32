#include "gif_player.h"
#include "oled.h"
#include "animation_data.h"
#include <Arduino.h>

void playGif(const uint8_t* gifData, size_t frameCount, unsigned long frameDelay) {
    for (size_t i = 0; i < frameCount; i++) {
        display.clearDisplay();
        display.drawBitmap(0, 0, gifData + (i * SCREEN_WIDTH * SCREEN_HEIGHT / 8), SCREEN_WIDTH, SCREEN_HEIGHT, SSD1306_WHITE);
        display.display();
        delay(frameDelay);
    }
}