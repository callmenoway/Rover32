"use client";

import { useState } from "react";
import JoystickControl from "@/components/JoystickControl";
import VideoStream from "@/components/VideoStream";
import { Input } from "@/components/ui/input";
import { useWebSocketStore } from "@/utils/websocket";
import DarkModeToggle from "@/components/DarkModeToggle";

export default function Home() {
  const [ip, setIp] = useState("192.168.1.26");
  const { status, message } = useWebSocketStore(); //stato WebSocket

  return (
    <div className="relative flex flex-col items-center space-y-6 p-6">
      <h1 className="text-3xl font-bold">Rover32</h1>
      <DarkModeToggle />
      
      <div className="absolute top-4 left-4 p-3 rounded-lg text-white shadow-md"
           style={{ backgroundColor: status === "connected" ? "green" : status === "error" ? "red" : "orange" }}>
        {message}
      </div>

      <Input type="text" value={ip} onChange={(e) => setIp(e.target.value)} placeholder="ESP32 IP Address" />
      <VideoStream ip={ip} />
      <JoystickControl ip={ip} />
    </div>
  );
}
