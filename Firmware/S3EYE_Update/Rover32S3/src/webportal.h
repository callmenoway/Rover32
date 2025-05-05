#ifndef WEBPORTAL_H
#define WEBPORTAL_H

#include <WiFi.h>
#include <DNSServer.h>
#include <WebServer.h>

// Function prototypes
void setupWebPortal();
void handleWebPortal();
void saveWiFiCredentials(const String& ssid, const String& password);
void loadWiFiCredentials(String& ssid, String& password);

// Externals
extern WebServer server;
extern DNSServer dnsServer;
extern bool apModeActive;

#endif // WEBPORTAL_H