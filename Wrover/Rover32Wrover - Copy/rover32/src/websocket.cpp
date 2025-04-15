#include "websocket.h"
#include "gif_player.h"
#include "oled.h"
#include <Arduino.h>

AsyncWebServer server(80);
AsyncWebSocket wsCam("/wsCam");
AsyncWebSocket wsControl("/wsControl");

void setupWebSockets() {
  // Set up WebSocket handlers
  wsCam.onEvent(onCamWsEvent);
  server.addHandler(&wsCam);

  wsControl.onEvent(onControlWsEvent);
  server.addHandler(&wsControl);

  // Start the web server
  server.begin();

  Serial.println("WebSocket servers started");
}

void onCamWsEvent(AsyncWebSocket *server, AsyncWebSocketClient *client,
                  AwsEventType type, void *arg, uint8_t *data, size_t len)
{
  if (type == WS_EVT_CONNECT)
    Serial.printf("[Camera WS] Client #%u connected\n", client->id());
  else if (type == WS_EVT_DISCONNECT)
    Serial.printf("[Camera WS] Client #%u disconnected\n", client->id());
}

void onControlWsEvent(AsyncWebSocket *server, AsyncWebSocketClient *client,
                      AwsEventType type, void *arg, uint8_t *data, size_t len)
{
  if (type == WS_EVT_CONNECT)
  {
    Serial.printf("[Control WS] Client #%u connected\n", client->id());
    displayBigText("Rover32");
    digitalWrite(stoplight, HIGH);
  }
  else if (type == WS_EVT_DISCONNECT)
  {
    Serial.printf("[Control WS] Client #%u disconnected\n", client->id());
    if (server->count() == 0)
    {
      displayIP("No clients connected");
      onTailLights();
      digitalWrite(stoplight, LOW);
    }
  }
  else if (type == WS_EVT_DATA)
  {
    String msg = "";
    for (size_t i = 0; i < len; i++)
    {
      msg += (char)data[i];
    }
    Serial.printf("[Control WS] Received: %s\n", msg.c_str());
    displayMotorAnimation();
    digitalWrite(stoplight, LOW);
    
    if (msg.equalsIgnoreCase("playGif"))
    {
      playGifOnOLED();
    }
    else if (msg.equalsIgnoreCase("go"))
    {
      moveForward();
    }
    else if (msg.equalsIgnoreCase("goSlow"))
    {
      moveForwardSlow();
    }
    else if (msg.equalsIgnoreCase("back"))
    {
      moveBackward();
    }
    else if (msg.equalsIgnoreCase("stop"))
    {
      stopMotors();
      displayBigText("Rover32");
      digitalWrite(stoplight, HIGH);
    }
    else if (msg.equalsIgnoreCase("drift"))
    {
      driftMode1();
    }
    else if (msg.equalsIgnoreCase("drift1"))
    {
      driftMode2();
    }
    else if (msg.equalsIgnoreCase("onHeadlights"))
    {
      onHeadLights();
    }
    else if (msg.equalsIgnoreCase("offHeadlights"))
    {
      offHeadLights();
    }
    else if (msg.startsWith("steer:"))
    {
      int angle = msg.substring(6).toInt();
      setSteeringAngle(angle);
    }
    else
      Serial.printf("Unknown command: %s\n", msg.c_str());
  }
}

void notifyCameraClients(const uint8_t *data, size_t len)
{
  wsCam.binaryAll((uint8_t *)data, len);
}