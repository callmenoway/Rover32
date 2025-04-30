#ifndef WEBSOCKET_H
#define WEBSOCKET_H

#include <AsyncTCP.h>
#include <ESPAsyncWebServer.h>
#include "config.h"

extern AsyncWebServer server;
extern AsyncWebSocket wsCam;
extern AsyncWebSocket wsControl;

void setupWebSockets();
void onCamWsEvent(AsyncWebSocket *server, AsyncWebSocketClient *client, 
                  AwsEventType type, void *arg, uint8_t *data, size_t len);
void onControlWsEvent(AsyncWebSocket *server, AsyncWebSocketClient *client,
                     AwsEventType type, void *arg, uint8_t *data, size_t len);
void notifyCameraClients(const uint8_t *data, size_t len);

#endif // WEBSOCKET_H