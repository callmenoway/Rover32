#include <WiFi.h>
#include <esp_camera.h>
#include <esp_http_server.h>
#include <WebSocketsServer.h> // Include the WebSocketsServer library

// WiFi credentials
const char* ssid = "H2O-Fi";
const char* password = "10Lauretta!";

// Camera server handle
httpd_handle_t camera_httpd = NULL;
#define PWDN_GPIO_NUM    -1
#define RESET_GPIO_NUM    -1
#define XCLK_GPIO_NUM      21
#define SIOD_GPIO_NUM      26
#define SIOC_GPIO_NUM      27

#define Y9_GPIO_NUM        35
#define Y8_GPIO_NUM        34
#define Y7_GPIO_NUM        39
#define Y6_GPIO_NUM        36
#define Y5_GPIO_NUM        19
#define Y4_GPIO_NUM        18
#define Y3_GPIO_NUM         5
#define Y2_GPIO_NUM         4
#define VSYNC_GPIO_NUM     25
#define HREF_GPIO_NUM      23
#define PCLK_GPIO_NUM      22

// WebSocket server on port 81
WebSocketsServer webSocket(81); // Set WebSocket server to port 81

// Camera configuration setup
void configureCamera() {
    camera_config_t config;
    config.ledc_channel = LEDC_CHANNEL_0;
    config.ledc_timer = LEDC_TIMER_0;
    config.pin_d0 = Y2_GPIO_NUM;
    config.pin_d1 = Y3_GPIO_NUM;
    config.pin_d2 = Y4_GPIO_NUM;
    config.pin_d3 = Y5_GPIO_NUM;
    config.pin_d4 = Y6_GPIO_NUM;
    config.pin_d5 = Y7_GPIO_NUM;
    config.pin_d6 = Y8_GPIO_NUM;
    config.pin_d7 = Y9_GPIO_NUM;
    config.pin_xclk = XCLK_GPIO_NUM;
    config.pin_pclk = PCLK_GPIO_NUM;
    config.pin_vsync = VSYNC_GPIO_NUM;
    config.pin_href = HREF_GPIO_NUM;
    config.pin_sscb_sda = SIOD_GPIO_NUM;
    config.pin_sscb_scl = SIOC_GPIO_NUM;
    config.pin_pwdn = PWDN_GPIO_NUM;
    config.pin_reset = RESET_GPIO_NUM;

    config.xclk_freq_hz = 28000000; // 20 MHz clock for stability, try 24MHz for higher speed
    config.pixel_format = PIXFORMAT_JPEG;

    // Adjust resolution and quality for performance
    config.frame_size = FRAMESIZE_VGA;  // Set lower resolutions like QVGA or CIF for faster speeds
    config.jpeg_quality = 10;            // Lower quality for faster transmission (higher compression)
    config.fb_count = 1;                 // Single buffer to save memory

    // Initialize the camera
    if (esp_camera_init(&config) != ESP_OK) {
        Serial.println("Camera initialization failed");
    }
}

// Stream handler
static esp_err_t stream_handler(httpd_req_t *req) {
    camera_fb_t *fb = NULL;
    esp_err_t res = ESP_OK;
    size_t jpg_buf_len;
    uint8_t *jpg_buf;
    char part_buf[64];

    res = httpd_resp_set_type(req, "multipart/x-mixed-replace; boundary=frame");
    if(res != ESP_OK) return res;

    while(true) {
        fb = esp_camera_fb_get();
        if (!fb) {
            Serial.println("Camera capture failed");
            res = ESP_FAIL;
            break;
        }

        if (fb->format != PIXFORMAT_JPEG) {
            bool converted = frame2jpg(fb, 80, &jpg_buf, &jpg_buf_len);
            if (!converted) {
                Serial.println("JPEG compression failed");
                esp_camera_fb_return(fb);
                res = ESP_FAIL;
                break;
            }
        } else {
            jpg_buf_len = fb->len;
            jpg_buf = fb->buf;
        }

        size_t header_len = snprintf(part_buf, 64, "--frame\r\nContent-Type: image/jpeg\r\nContent-Length: %u\r\n\r\n", jpg_buf_len);
        res = httpd_resp_send_chunk(req, part_buf, header_len);
        if (res == ESP_OK) {
            res = httpd_resp_send_chunk(req, (const char *)jpg_buf, jpg_buf_len);
        }
        if (res == ESP_OK) {
            res = httpd_resp_send_chunk(req, "\r\n", 2);
        }

        if (fb->format != PIXFORMAT_JPEG) {
            free(jpg_buf);
        }
        esp_camera_fb_return(fb);
        if (res != ESP_OK) break;
    }
    return res;
}

// Start camera server
void startCameraServer() {
    httpd_config_t config = HTTPD_DEFAULT_CONFIG();
    config.max_uri_handlers = 2;
    config.backlog_conn = 1;  // Single client connection

    httpd_uri_t stream_uri = {
        .uri = "/",
        .method = HTTP_GET,
        .handler = stream_handler,
        .user_ctx = NULL
    };

    if (httpd_start(&camera_httpd, &config) == ESP_OK) {
        httpd_register_uri_handler(camera_httpd, &stream_uri);
    } else {
        Serial.println("Failed to start web server");
    }
}

// WebSocket event handler
void handleWebSocketEvent(uint8_t num, WStype_t type, uint8_t * payload, size_t length) {
    Serial.println("WebSocket event received");

    // Handle different WebSocket event types
    switch(type) {
        case WStype_DISCONNECTED:
            Serial.printf("Client %u disconnected\n", num);
            break;
        case WStype_CONNECTED:
            Serial.printf("Client %u connected\n", num);
            break;
        case WStype_TEXT:
            Serial.printf("Received text: %s\n", payload);
            // Handle incoming text (e.g., commands)
            break;
        case WStype_BIN:
            Serial.printf("Received binary data, length: %d\n", length);
            // Handle incoming binary data (e.g., images)
            break;
    }
}

void setup() {
    Serial.begin(115200);

    // WiFi setup
    WiFi.begin(ssid, password);
    while (WiFi.status() != WL_CONNECTED) {
        delay(500);
        Serial.print(".");
    }
    Serial.println();
    Serial.print("Connected to WiFi, IP address: ");
    Serial.println(WiFi.localIP());

    // Configure and initialize the camera
    configureCamera();

    // Start the web server for the camera
    startCameraServer();

    // Start WebSocket server
    webSocket.begin();
    webSocket.onEvent(handleWebSocketEvent);  // Register WebSocket event handler
}

void loop() {
    // Keep the WebSocket server running
    webSocket.loop();
}
