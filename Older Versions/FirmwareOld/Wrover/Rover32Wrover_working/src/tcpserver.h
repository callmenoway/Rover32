#ifndef TCPSERVER_H
#define TCPSERVER_H

#include <WiFi.h>
#include "config.h"

// Define ports for camera and control connections
#define CAM_PORT 8000
#define CONTROL_PORT 8001
#define MAX_CLIENTS 5

extern WiFiServer camServer;
extern WiFiServer controlServer;
extern WiFiClient camClients[MAX_CLIENTS];
extern WiFiClient controlClients[MAX_CLIENTS];

void setupTcpServers();
void handleTcpConnections();
void notifyCameraClients(const uint8_t *data, size_t len);
void sendToControlClients(const char* message);

#endif // TCPSERVER_H