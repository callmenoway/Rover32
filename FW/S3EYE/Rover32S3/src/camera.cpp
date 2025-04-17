#include "camera.h"
#include "oled.h"
#include <Arduino.h>

camera_config_t camera_config;

void setupCamera()
{
  Serial.println("Starting camera configuration...");

  if (!psramFound())
  {
    Serial.println("PSRAM not found. Camera initialization may fail");
  }
  else
  {
    Serial.println("PSRAM found and initialized");
  }

  camera_config.ledc_channel = LEDC_CHANNEL_0;
  camera_config.ledc_timer = LEDC_TIMER_0;
  camera_config.pin_pwdn = PWDN_GPIO_NUM;
  camera_config.pin_reset = RESET_GPIO_NUM;
  camera_config.pin_xclk = XCLK_GPIO_NUM;
  camera_config.pin_sccb_sda = SIOD_GPIO_NUM;
  camera_config.pin_sccb_scl = SIOC_GPIO_NUM;
  camera_config.pin_d0 = Y2_GPIO_NUM;
  camera_config.pin_d1 = Y3_GPIO_NUM;
  camera_config.pin_d2 = Y4_GPIO_NUM;
  camera_config.pin_d3 = Y5_GPIO_NUM;
  camera_config.pin_d4 = Y6_GPIO_NUM;
  camera_config.pin_d5 = Y7_GPIO_NUM;
  camera_config.pin_d6 = Y8_GPIO_NUM;
  camera_config.pin_d7 = Y9_GPIO_NUM;
  camera_config.pin_vsync = VSYNC_GPIO_NUM;
  camera_config.pin_href = HREF_GPIO_NUM;
  camera_config.pin_pclk = PCLK_GPIO_NUM;
  camera_config.xclk_freq_hz = 40000000; // Lower frequency for stability
  camera_config.pixel_format = PIXFORMAT_JPEG;
  camera_config.fb_location = CAMERA_FB_IN_PSRAM;
  camera_config.frame_size = FRAMESIZE_QVGA; // Use CIF (352x288) for smoother streaming
  camera_config.jpeg_quality = 25;          // Slightly lower quality for faster encoding
  camera_config.fb_count = 4;               // Increase frame buffers to 4

  esp_err_t err = esp_camera_init(&camera_config);
  if (err != ESP_OK)
  {
    Serial.printf("Camera init failed with error 0x%x\n", err);
    displayText("Rover32\nCamera Error");
    return;
  }

  Serial.println("Camera init succeeded.");
  displayText("Rover32\nCamera Ready\nPSRAM: OK");
}

camera_fb_t* captureFrame()
{
  // Capture a frame from the camera
  camera_fb_t* fb = esp_camera_fb_get();
  if (!fb)
  {
    Serial.println("Camera capture failed");
  }
  return fb;
}

void releaseFrame(camera_fb_t* fb)
{
  // Release the frame buffer
  if (fb)
  {
    esp_camera_fb_return(fb);
  }
}