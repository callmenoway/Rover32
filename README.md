<p align="center">
  <img src="./Rover32/public/rover32.png">
</p>

<h1 align="center">ROVER32</h1>

<p align="center"><i>Empowering seamless control for your robotic adventures.</i></p>

<p align="center">
  <!-- Ultimo commit -->
  <img src="https://img.shields.io/github/last-commit/callmenoway/Rover32?style=flat&logo=git&logoColor=white&color=0080ff" />
  
  <!-- Linguaggio principale -->
  <img src="https://img.shields.io/github/languages/top/callmenoway/Rover32?style=flat&color=0080ff" />

  <!-- Conteggio linguaggi -->
  <img src="https://img.shields.io/github/languages/count/callmenoway/Rover32?style=flat&color=0080ff" />

  <!-- Dimensione repo -->
  <img src="https://img.shields.io/github/repo-size/callmenoway/Rover32?style=flat&color=0080ff&logo=database&logoColor=white" />

  <!-- Stars -->
  <img src="https://img.shields.io/github/stars/callmenoway/Rover32?style=flat&color=0080ff&logo=github&logoColor=white" />

  <!-- Forks -->
  <img src="https://img.shields.io/github/forks/callmenoway/Rover32?style=flat&color=0080ff&logo=code-fork&logoColor=white" />

  <!-- Issues aperti -->
  <img src="https://img.shields.io/github/issues/callmenoway/Rover32?style=flat&color=0080ff&logo=githubissues&logoColor=white" />

  <!-- Licenza -->
  <img src="https://img.shields.io/github/license/callmenoway/Rover32?style=flat&color=0080ff&logo=open-source-initiative&logoColor=white" />
</p>

<p align="center"><i>Built with the tools and technologies:</i></p>

<p align="center">
  <img src="https://img.shields.io/badge/JSON-000000.svg?style=flat&logo=JSON&logoColor=white" />
  <img src="https://img.shields.io/badge/npm-CB3837.svg?style=flat&logo=npm&logoColor=white" />
  <img src="https://img.shields.io/badge/JavaScript-F7DF1E.svg?style=flat&logo=JavaScript&logoColor=black" />
  <img src="https://img.shields.io/badge/React-%2320232a.svg?logo=react&logoColor=%2361DAFB" />
  <img src="https://img.shields.io/badge/NextJs-000000?style=flat&logo=next.js&logoColor=white" />
  <img src="https://img.shields.io/badge/tailwindcss-0F172A?&logo=tailwindcss" />
  <img src="https://img.shields.io/badge/Dart-0175C2.svg?style=flat&logo=Dart&logoColor=white" />
  <img src="https://img.shields.io/badge/C++-%2300599C.svg?logo=c%2B%2B&logoColor=white" />
  <img src="https://img.shields.io/badge/XML-005FAD.svg?style=flat&logo=XML&logoColor=white" />
  <img src="https://img.shields.io/badge/Flutter-02569B.svg?style=flat&logo=Flutter&logoColor=white" />
  <img src="https://img.shields.io/badge/shadcn%2Fui-000?logo=shadcnui&logoColor=fff" />
  <img src="https://img.shields.io/badge/CSS-1572B6?logo=css3&logoColor=fff" />
  <img src="https://img.shields.io/badge/Node.js-6DA55F?logo=node.js&logoColor=white" />
  <img src="https://img.shields.io/badge/Python-3776AB.svg?style=flat&logo=Python&logoColor=white" />
  <img src="https://img.shields.io/badge/TypeScript-3178C6.svg?style=flat&logo=TypeScript&logoColor=white" />
  <img src="https://img.shields.io/badge/Postgres-%23316192.svg?logo=postgresql&logoColor=white" />
  <img src="https://img.shields.io/badge/Supabase-3FCF8E?logo=supabase&logoColor=fff" />
  <img src="https://img.shields.io/badge/Prisma-2D3748.svg?style=flat&logo=Prisma&logoColor=white" />
  <img src="https://img.shields.io/badge/Zod-3E67B1.svg?style=flat&logo=Zod&logoColor=white" />
  <img src="https://img.shields.io/badge/ESLint-4B32C3.svg?style=flat&logo=ESLint&logoColor=white" />
  <img src="https://img.shields.io/badge/React_Router-CA4245?logo=react-router&logoColor=white" />
  <img src="https://img.shields.io/badge/YAML-CB171E.svg?style=flat&logo=YAML&logoColor=white" />
  <img src="https://img.shields.io/badge/Docker-2496ED?logo=docker&logoColor=fff" />
</p>

## Overview

Rover32 is a versatile ESP32-based robotic platform that combines real-time video streaming, remote control capabilities, and a web interface for management and analytics. It's designed for educational and experimental purposes, providing a flexible architecture for building autonomous robots and remote-controlled vehicles.

## Key Features

- **Real-time Video Streaming**: Live camera feed via WebSocket connection
- **Remote Control**: Control movement, steering, and special functions wirelessly
- **Cross-platform Client**: Flutter desktop application for Windows, macOS, and Linux
- **Web Administration**: Analytics dashboard and vehicle management
- **OLED Display**: Status information and animations on the rover
- **Customizable Lighting**: Headlights, taillights, and status indicators

## Hardware Components

- **ESP32 Microcontroller**: Core processing unit with Wi-Fi and Bluetooth connectivity
- **Camera Module**: OV2640 camera for video streaming
- **Motors & L298N Driver**: Dual H-bridge motor controller for precise movement
- **SSD1306 OLED Display**: 128x32 monochrome display for status information
- **LED Lighting System**: Programmable status and navigation lights

## Software Architecture

The Rover32 system consists of multiple integrated components:

### ESP32 Firmware

- Written in C++ using PlatformIO/Arduino framework
- Manages camera capture, motor control, and TCP communication
- Handles WebSocket connections for both control and camera streaming
- OLED display management for status information

### TCP Protocol

- Raw TCP sockets for direct communication with minimal overhead
- Camera streaming (port 8000) and control commands (port 8001)
- Binary protocol with JPEG frames for video

### Flutter Desktop Application

- Cross-platform desktop application written in Flutter/Dart
- Provides control interface with keyboard/virtual joystick support
- Displays camera feed in real-time
- Manages connection to the rover

### Web Dashboard

- Built with Next.js, React, and TypeScript
- User authentication and vehicle management
- Statistics gathering and visualization
- API for integration with other services

## Documentation

Scan this QR code to access the complete documentation:

<p align="center">
  <img src="./Rover32/public/qr-code.png" alt="Documentation QR Code" width="300" />
</p>


Or visit the [online documentation](https://github.com/callmenoway/rover32) for:

- Setup guides
- API references
- Hardware schematics
- Troubleshooting information

## Technology Stack

### Backend
- **Next.js API Routes**: Server-side functionality and API endpoints
- **tRPC**: End-to-end typesafe API framework
- **Zod**: Schema validation for runtime type checking

### Frontend
- **React**: Component-based UI library
- **TypeScript**: Static type-checking for JavaScript
- **Tailwind CSS**: Utility-first CSS framework
- **shadcn/ui**: Reusable, accessible UI components
- **Radix UI**: Unstyled, accessible UI primitives
- **Lucide React**: SVG icon library

### Database & ORM
- **Prisma**: Modern ORM for database access
- **Supabase**: PostgreSQL-based database with integrated authentication

## Setup Instructions

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/callmenoway/rover32.git
   cd rover32
