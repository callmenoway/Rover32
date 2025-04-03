"use client";
import { useEffect, useState } from "react";
import { Joystick } from "react-joystick-component";
import { WebSocketClient } from "@/utils/websocket";
import { Button } from "@/components/ui/button";

export default function JoystickControl({ ip }: { ip: string }) {
  const [ws, setWs] = useState<WebSocketClient | null>(null);
  const [steering, setSteering] = useState(90);

  useEffect(() => {
    const socket = new WebSocketClient(ip);
    setWs(socket);
    return () => socket.close();
  }, [ip]);

  //controllo Joystick Fisico
  useEffect(() => {
    const handleGamepad = () => {
      const gamepads = navigator.getGamepads();
      if (!gamepads) return;

      const pad = gamepads[0]; //usa il primo controller
      if (pad) {
        const steer = pad.axes[0]; //analogico sinistro per sterzo
        const rt = pad.buttons[7].value; //RT per accelerare
        const lt = pad.buttons[6].value; //LT per retrocedere

        const angle = Math.min(Math.max(90 + steer * 90, 0), 180);
        setSteering(angle);
        ws?.sendCommand(`steer:${Math.round(angle)}`);

        if (rt > 0.1) ws?.sendCommand("go");
        else if (lt > 0.1) ws?.sendCommand("back");
        else ws?.sendCommand("stop");
      }
    };

    window.addEventListener("gamepadconnected", () => {
      console.log("Gamepad Connected");
      setInterval(handleGamepad, 100);
    });

    return () => window.removeEventListener("gamepadconnected", handleGamepad);
  }, [ws]);

  return (
    <div className="flex flex-col items-center">
      <h2 className="text-xl font-bold">C</h2>
      <Joystick
        size={120}
        baseColor="#eee"
        stickColor="#333"
        move={(e) => {
          const x = e.x ?? 0;
          //const y = e.y ?? 0;
          const angle = Math.min(Math.max(90 + x * 90, 0), 180);
          
          setSteering(angle);
          ws?.sendCommand(`steer:${Math.round(angle)}`);

          //if (y > 0.5) ws?.sendCommand("back");
          //else if (y < -0.5) ws?.sendCommand("go");
          //else ws?.sendCommand("stop");
        }}
      />

      <p>Sterzo: {Math.round(steering)}°</p>
      <div className="grid grid-cols-3 gap-4 mt-4">
        <Button onClick={() => ws?.sendCommand("go")}>Avanti</Button>
        <Button onClick={() => ws?.sendCommand("stop")}>Stop</Button>
        <Button onClick={() => ws?.sendCommand("back")}>Indietro</Button>
      </div>
    </div>
  );
}
