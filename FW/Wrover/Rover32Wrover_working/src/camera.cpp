#include "camera.h"
#include "oled.h"
#include <Arduino.h>


camera_config_t camera_config;

void setupCamera()
{
  Serial.println("Starting camera configuration...");
  
  // Check if PSRAM is enabled
  if(!psramFound()) {
    Serial.println("PSRAM not found. Camera initialization may fail");
  } else {
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

  // Increase clock frequency for better performance
  camera_config.xclk_freq_hz = 40000000;  // Try 20MHz instead of 40MHz (might be more stable)
  camera_config.pixel_format = PIXFORMAT_JPEG;

  // Use PSRAM for buffer if available
  camera_config.fb_location = CAMERA_FB_IN_PSRAM;

  // Use a resolution that's optimized for speed
  camera_config.frame_size = FRAMESIZE_QVGA;  // 320x240 - good balance of quality and speed
  camera_config.jpeg_quality = 40;  // 0-63, lower is higher quality but 12 is good for speed
  camera_config.fb_count = 2;  // Use 2 frame buffers for better streaming

  int retry_count = 0;
  esp_err_t err = ESP_FAIL;
  
  // Try to initialize with progressively lower requirements if initial attempt fails
  while (err != ESP_OK && retry_count < 3) {
    Serial.printf("Camera init attempt %d...\n", retry_count + 1);
    
    err = esp_camera_init(&camera_config);
    
    if (err != ESP_OK) {
      Serial.printf("Camera init failed with error 0x%x, retrying with lower specs\n", err);
      
      // Reduce requirements on each retry
      if (retry_count == 0) {
        // First retry: Lower resolution
        camera_config.frame_size = FRAMESIZE_QVGA;  // 320x240
        camera_config.fb_count = 1;
      } else if (retry_count == 1) {
        // Second retry: Lower quality further
        camera_config.jpeg_quality = 44;  // Lower quality
      }
      
      retry_count++;
      delay(100);
    }
  }

  if (err != ESP_OK) {
    Serial.printf("Camera init failed with error 0x%x after multiple attempts\n", err);
    displayText("Rover32\nCamera Error\n"+err);
    return;
  }
  
  Serial.println("Camera init succeeded.");
  displayText("Rover32\nCamera Ready\nPSRAM: OK");
  // Optimize sensor settings for performance
  sensor_t * s = esp_camera_sensor_get();
  if (s) {
    // Use QVGA for better performance
    s->set_framesize(s, FRAMESIZE_QVGA);  // 320x240
    
    // Performance-optimized settings
    s->set_quality(s, 35);       // 0-63, lower number = higher quality, 12 is good balance
    s->set_brightness(s, 1);     // -2 to 2 (increased from 0 to 1 for brighter image)
    s->set_contrast(s, 0);       // -2 to 2
    s->set_saturation(s, 0);     // -2 to 2
    s->set_special_effect(s, 0); // No special effect
    s->set_whitebal(s, 1);       // Enable
    s->set_awb_gain(s, 1);       // Enable
    s->set_wb_mode(s, 0);        // Auto
    s->set_exposure_ctrl(s, 1);  // Enable
    s->set_aec2(s, 0);           // Disable - can increase frame rate
    s->set_ae_level(s, 1);       // -2 to 2 (increased from 0 to 1 for brighter image)
    s->set_gain_ctrl(s, 1);      // Enable
    s->set_agc_gain(s, 5);       // 0 to 30 (increased from 0 to 5 for brighter image)
    s->set_gainceiling(s, (gainceiling_t)2);  // 0 to 6 (increased from 0 to 2 for brighter image)
    s->set_bpc(s, 0);            // Disable - increases speed
    s->set_wpc(s, 0);            // Disable - increases speed
    s->set_raw_gma(s, 0);        // Disable - increases speed
    s->set_lenc(s, 0);           // Disable - increases speed
    s->set_hmirror(s, 0);        // 0 = disable
    s->set_vflip(s, 0);          // 0 = disable
    s->set_dcw(s, 0);            // Disable - increases speed
  }
}

camera_fb_t* captureFrame() {
  camera_fb_t* fb = esp_camera_fb_get();
  return fb;
}

// Add this function to properly release the frame buffer after use
void releaseFrame(camera_fb_t* fb) {
  if (fb) {
    esp_camera_fb_return(fb);
  }
}