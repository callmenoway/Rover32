#include "motors.h"
#include <Arduino.h>

Servo steeringServo;

void setupMotors() {
  // Initialize motor pins
  pinMode(LEFT_IN1, OUTPUT);
  pinMode(LEFT_IN2, OUTPUT);
  pinMode(LEFT_EN, OUTPUT);
  pinMode(RIGHT_IN1, OUTPUT);
  pinMode(RIGHT_IN2, OUTPUT);
  pinMode(RIGHT_EN, OUTPUT);

  digitalWrite(LEFT_IN1, LOW);
  digitalWrite(LEFT_IN2, LOW);
  digitalWrite(LEFT_EN, LOW);
  digitalWrite(RIGHT_IN1, LOW);
  digitalWrite(RIGHT_IN2, LOW);
  digitalWrite(RIGHT_EN, LOW);

  // Initialize the servo
  steeringServo.attach(SERVO_PIN);
  steeringServo.write(90); // Center position
}

void moveForward(int speed) {
  analogWrite(LEFT_EN, speed);
  analogWrite(RIGHT_EN, speed);
  analogWrite(LEFT_IN1, 0);
  analogWrite(LEFT_IN2, speed);
  analogWrite(RIGHT_IN1, speed);
  analogWrite(RIGHT_IN2, 0);
  Serial.println("Motors moving forward");
}

void moveForwardSlow(int speed) {
  analogWrite(LEFT_EN, speed);
  analogWrite(RIGHT_EN, speed);
  analogWrite(LEFT_IN1, 0);
  analogWrite(LEFT_IN2, speed);
  analogWrite(RIGHT_IN1, speed);
  analogWrite(RIGHT_IN2, 0);
  Serial.println("Motors moving forward slowly");
}

void moveBackward(int speed) {
  analogWrite(LEFT_EN, speed);
  analogWrite(RIGHT_EN, speed);
  analogWrite(LEFT_IN1, speed);
  analogWrite(LEFT_IN2, 0);
  analogWrite(RIGHT_IN1, 0);
  analogWrite(RIGHT_IN2, speed);
  Serial.println("Motors moving backward");
}

void stopMotors() {
  analogWrite(LEFT_EN, 0);
  analogWrite(RIGHT_EN, 0);
  digitalWrite(LEFT_EN, LOW);
  digitalWrite(RIGHT_IN1, LOW);
  digitalWrite(RIGHT_IN2, LOW);
  digitalWrite(RIGHT_EN, LOW);
  Serial.println("Motors stopping");
}

// First drift mode
void driftMode1() {
  analogWrite(LEFT_EN, 255);
  analogWrite(RIGHT_EN, 255);
  analogWrite(LEFT_IN1, 255);
  analogWrite(LEFT_IN2, 0);
  analogWrite(RIGHT_IN1, 255);
  analogWrite(RIGHT_IN2, 0);
  Serial.println("Drift mode 1 activated");
}

// Second drift mode
void driftMode2() {
  analogWrite(LEFT_EN, 255);
  analogWrite(RIGHT_EN, 255);
  analogWrite(LEFT_IN1, 0);
  analogWrite(LEFT_IN2, 255);
  analogWrite(RIGHT_IN1, 0);
  analogWrite(RIGHT_IN2, 255);
  Serial.println("Drift mode 2 activated");
}

void setSteeringAngle(int angle) {
  angle = constrain(angle, 30, 130);
  steeringServo.write(angle);
  Serial.printf("Steering angle set to %d\n", angle);
}