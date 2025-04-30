#ifndef LIGHTS_H
#define LIGHTS_H

#include <Adafruit_NeoPixel.h>
#include "config.h"

extern Adafruit_NeoPixel pixels;

void setupLights();
void blinkTailLights();
void onTailLights();
void offTailLights();
void onHeadLights();
void offHeadLights();
void offAllLights();
void setArgbLight(int r, int g, int b);

#endif // LIGHTS_H