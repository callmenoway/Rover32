#ifndef ANIMATION_DATA_H
#define ANIMATION_DATA_H

#include <Arduino.h>

// Define the structure for a single GIF frame
struct GifFrame {
    const uint8_t* data; // Pointer to the frame data
    size_t length;       // Length of the frame data
    unsigned long delay; // Delay before displaying the next frame (in milliseconds)
};

// Example GIF frames (replace with actual frame data)
extern const GifFrame gifFrames[];

// Total number of frames in the GIF
extern const size_t gifFrameCount;

#endif // ANIMATION_DATA_H