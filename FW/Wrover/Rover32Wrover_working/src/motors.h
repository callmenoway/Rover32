#ifndef MOTORS_H
#define MOTORS_H

#include <ESP32Servo.h>
#include "config.h"

extern Servo steeringServo;

void setupMotors();
void moveForward(int speed = 255);
void moveForwardSlow(int speed = 100);
void moveBackward(int speed = 150);
void stopMotors();
void driftMode1();
void driftMode2();
void setSteeringAngle(int angle);

#endif // MOTORS_H