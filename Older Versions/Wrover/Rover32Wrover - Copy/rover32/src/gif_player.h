#ifndef GIF_PLAYER_H
#define GIF_PLAYER_H

#include "oled.h"

// Function to initialize the GIF player
void setupGifPlayer();

// Function to play a GIF animation on the OLED display
void playGif(const uint8_t* gifData, size_t gifSize);

#endif // GIF_PLAYER_H