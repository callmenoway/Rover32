"use client";
import { useEffect, useRef } from "react";

export default function VideoStream({ ip }: { ip: string }) {
  const videoRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const ws = new WebSocket(`ws://${ip}/wsCam`);
    ws.binaryType = "arraybuffer";

    ws.onmessage = (event) => {
      if (event.data instanceof ArrayBuffer) {
        const blob = new Blob([event.data], { type: "image/jpeg" });
        if (videoRef.current) {
          videoRef.current.src = URL.createObjectURL(blob);
        }
      }
    };

    return () => ws.close();
  }, [ip]);

  return <img ref={videoRef} className="w-[320px] h-[240px] rounded-lg border shadow-md" alt="ESP32 Camera" />;
}
