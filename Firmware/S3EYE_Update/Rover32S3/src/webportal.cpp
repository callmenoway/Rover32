#include "webportal.h"
#include "oled.h"
#include "config.h"
#include <EEPROM.h>

#define DNS_PORT 53
#define WIFI_CONFIG_START 0
#define MAX_SSID_LENGTH 32
#define MAX_PASSWORD_LENGTH 64

WebServer server(80);
DNSServer dnsServer;
bool apModeActive = false;

// HTML for the configuration page with improved styling
const char* configPage = R"rawliteral(
<!DOCTYPE html>
<html>
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Rover32 WiFi Setup</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      margin: 0;
      padding: 20px;
      background-color: #f0f0f0;
      color: #333;
    }
    .container {
      max-width: 500px;
      margin: 0 auto;
      background: white;
      padding: 20px;
      border-radius: 10px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    }
    h1 {
      text-align: center;
      color: #0066cc;
    }
    label {
      display: block;
      margin: 15px 0 5px;
      font-weight: bold;
    }
    input {
      width: 100%;
      padding: 10px;
      border: 1px solid #ddd;
      border-radius: 4px;
      box-sizing: border-box;
      margin-bottom: 15px;
    }
    button {
      background-color: #0066cc;
      color: white;
      border: none;
      padding: 12px 20px;
      border-radius: 4px;
      cursor: pointer;
      width: 100%;
      font-size: 16px;
    }
    button:hover {
      background-color: #0052a3;
    }
    .status {
      margin-top: 20px;
      padding: 10px;
      border-radius: 4px;
      text-align: center;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>Rover32 WiFi Setup</h1>
    <form action="/save" method="POST">
      <label for="ssid">WiFi Network Name:</label>
      <input type="text" id="ssid" name="ssid" placeholder="Enter your WiFi SSID" required>
      
      <label for="password">WiFi Password:</label>
      <input type="password" id="password" name="password" placeholder="Enter your WiFi password">
      
      <button type="submit">Connect</button>
    </form>
    <div class="status">
      Enter your WiFi credentials to connect Rover32 to your network
    </div>
  </div>
</body>
</html>
)rawliteral";

const char* successPage = R"rawliteral(
<!DOCTYPE html>
<html>
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Rover32 WiFi Setup</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      margin: 0;
      padding: 20px;
      background-color: #f0f0f0;
      color: #333;
      text-align: center;
    }
    .container {
      max-width: 500px;
      margin: 0 auto;
      background: white;
      padding: 20px;
      border-radius: 10px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    }
    h1 {
      color: #0066cc;
    }
    .success {
      color: #4CAF50;
      font-size: 18px;
      margin: 20px 0;
    }
    .info {
      margin: 15px 0;
      line-height: 1.5;
    }
  </style>
  <meta http-equiv="refresh" content="10;url=/">
</head>
<body>
  <div class="container">
    <h1>Rover32 WiFi Setup</h1>
    <div class="success">✓ Settings Saved Successfully!</div>
    <div class="info">
      WiFi credentials have been saved.<br>
      The Rover32 will now attempt to connect to your network.<br>
      This access point will turn off if connection is successful.
    </div>
  </div>
</body>
</html>
)rawliteral";

// Function to save WiFi credentials to EEPROM
void saveWiFiCredentials(const String& ssid, const String& password) {
  EEPROM.begin(MAX_SSID_LENGTH + MAX_PASSWORD_LENGTH + 2);
  
  // Save SSID length and string
  EEPROM.write(WIFI_CONFIG_START, ssid.length());
  for (int i = 0; i < ssid.length(); i++) {
    EEPROM.write(WIFI_CONFIG_START + 1 + i, ssid[i]);
  }
  
  // Save password length and string
  EEPROM.write(WIFI_CONFIG_START + MAX_SSID_LENGTH + 1, password.length());
  for (int i = 0; i < password.length(); i++) {
    EEPROM.write(WIFI_CONFIG_START + MAX_SSID_LENGTH + 2 + i, password[i]);
  }
  
  EEPROM.commit();
}

// Function to load WiFi credentials from EEPROM
void loadWiFiCredentials(String& ssid, String& password) {
  EEPROM.begin(MAX_SSID_LENGTH + MAX_PASSWORD_LENGTH + 2);
  
  // Read SSID
  int ssidLength = EEPROM.read(WIFI_CONFIG_START);
  if (ssidLength > 0 && ssidLength < MAX_SSID_LENGTH) {
    for (int i = 0; i < ssidLength; i++) {
      ssid += (char)EEPROM.read(WIFI_CONFIG_START + 1 + i);
    }
  }
  
  // Read password
  int passwordLength = EEPROM.read(WIFI_CONFIG_START + MAX_SSID_LENGTH + 1);
  if (passwordLength > 0 && passwordLength < MAX_PASSWORD_LENGTH) {
    for (int i = 0; i < passwordLength; i++) {
      password += (char)EEPROM.read(WIFI_CONFIG_START + MAX_SSID_LENGTH + 2 + i);
    }
  }
}

// Set up the access point and web server
void setupWebPortal() {
  // Create access point
  String apName = "Rover32_Setup";
  WiFi.softAP(apName.c_str());
  delay(100);
  
  IPAddress apIP = WiFi.softAPIP();
  Serial.print("AP IP address: ");
  Serial.println(apIP);
  
  // If DNSServer is started with "*" for domain name, it will reply with
  // provided IP to all DNS request (captive portal)
  dnsServer.start(DNS_PORT, "*", apIP);
  
  // Routes for web page
  server.on("/", HTTP_GET, []() {
    server.sendHeader("Cache-Control", "no-cache, no-store, must-revalidate");
    server.sendHeader("Pragma", "no-cache");
    server.sendHeader("Expires", "-1");
    server.send(200, "text/html", configPage);
  });
  
  // When form submitted
  server.on("/save", HTTP_POST, []() {
    String newSsid = server.arg("ssid");
    String newPassword = server.arg("password");
    
    if (newSsid.length() > 0) {
      saveWiFiCredentials(newSsid, newPassword);
      server.send(200, "text/html", successPage);
      
      // Display on OLED
      displayText("Rover32\nNew WiFi saved\n" + newSsid);
      
      // Update the global WiFi credentials for immediate use
      sta_ssid = strdup(newSsid.c_str());
      sta_password = strdup(newPassword.c_str());
    }
    else {
      server.send(400, "text/plain", "Invalid inputs");
    }
  });
  
  // Handle captive portal requests
  server.onNotFound([]() {
    server.sendHeader("Location", "http://" + WiFi.softAPIP().toString(), true);
    server.send(302, "text/plain", "");
  });
  
  // Start server
  server.begin();
  apModeActive = true;
  
  // Display on OLED
  displayText("WiFi Setup Mode\nConnect to:\n" + apName + "\nThen open:\n" + apIP.toString());
}

// Process DNS and web server requests
void handleWebPortal() {
  if (apModeActive) {
    dnsServer.processNextRequest();
    server.handleClient();
  }
}