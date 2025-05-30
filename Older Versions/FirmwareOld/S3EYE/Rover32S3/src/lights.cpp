#include "lights.h"
#include <Arduino.h>

Adafruit_NeoPixel pixels = Adafruit_NeoPixel(1, ARGBlight, NEO_GRB + NEO_KHZ800);


void setupLights() {
  // Initialize light pins
  for (int i = 0; i < HEADLIGHTS_COUNT; i++) {
    pinMode(headlights[i], OUTPUT);
  }
  for (int i = 0; i < TAILLIGHTS_COUNT; i++) {
    pinMode(taillights[i], OUTPUT);
  }
  pinMode(stoplight, OUTPUT);
  digitalWrite(stoplight, HIGH);
  digitalWrite(taillights[0], LOW);
  offAllLights();
  pixels.begin();
}

void blinkTailLights()
{
  for (int j = 0; j < 5; j++)
  {
    for (int i = 0; i < TAILLIGHTS_COUNT; i++)
    {
      digitalWrite(taillights[i], HIGH);
    }
    delay(500);
    for (int i = 0; i < TAILLIGHTS_COUNT; i++)
    {
      digitalWrite(taillights[i], LOW);
    }
  }
}

void onTailLights()
{
  for (int i = 0; i < TAILLIGHTS_COUNT; i++)
  {
    digitalWrite(taillights[i], HIGH);
  }
}

void offTailLights()
{
  for (int i = 0; i < TAILLIGHTS_COUNT; i++)
  {
    digitalWrite(taillights[i], LOW);
  }
}

void onHeadLights()
{
  for (int i = 0; i < HEADLIGHTS_COUNT; i++)
  {
    digitalWrite(headlights[i], HIGH);
  }
}

void offHeadLights()
{
  for (int i = 0; i < HEADLIGHTS_COUNT; i++)
  {
    digitalWrite(headlights[i], LOW);
  }
}

void offAllLights()
{
  for (int i = 0; i < HEADLIGHTS_COUNT; i++)
  {
    digitalWrite(headlights[i], LOW);
  }
  for (int i = 0; i < TAILLIGHTS_COUNT; i++)
  {
    digitalWrite(taillights[i], LOW);
  }
  digitalWrite(stoplight, LOW);
}

void setArgbLight(int r, int g, int b) {
  pixels.setPixelColor(0, pixels.Color(r, g, b)); //Colore rosso
  pixels.show();
}