#ifndef CAMERA_H
#define CAMERA_H

#include "esp_camera.h"
#include "config.h"

extern camera_config_t camera_config;

void setupCamera();
camera_fb_t* captureFrame();
void releaseFrame(camera_fb_t* fb);

#endif // CAMERA_H