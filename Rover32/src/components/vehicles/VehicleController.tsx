"use client";

import { useEffect, useState } from "react";
import { Joystick } from "react-joystick-component";
import { IJoystickUpdateEvent } from "react-joystick-component/build/lib/Joystick";
import { useTheme } from "next-themes";
import { Loader2, AlertCircle } from "lucide-react";

//? Importazioni dei componenti UI
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/src/components/ui/alert";
import { Vehicle } from "@/src/types";

//? Definizione dell'interfaccia delle props del componente
interface VehicleControllerProps {
  vehicle: Vehicle;
}

//? Componente principale per il controllo del veicolo
export default function VehicleController({ vehicle }: VehicleControllerProps) {
  const { theme } = useTheme();
  const [wsCam, setWsCam] = useState<WebSocket | null>(null);
  const [wsControl, setWsControl] = useState<WebSocket | null>(null);
  const [cameraFeed, setCameraFeed] = useState<string>("");
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (vehicle) {
      connectToVehicle();
    }

    //? Pulizia delle connessioni WebSocket
    return () => {
      wsCam?.close();
      wsControl?.close();
    };
  }, [vehicle]);

  //? Funzione per stabilire le connessioni WebSocket al veicolo
  const connectToVehicle = async () => {
    if (isConnecting || isConnected) return;

    setIsConnecting(true);
    setConnectionError(null);

    try {
      //? Determina il protocollo (wss per HTTPS, ws per HTTP)
      const protocol = location.protocol === "https:" ? "wss://" : "ws://";
      const ipAddress = vehicle.ipAddress;

      //? Connessione al WebSocket della camera
      const wsCamInstance = new WebSocket(`${protocol}${ipAddress}:81/wsCam`);

      //? Handler per l'apertura della connessione
      wsCamInstance.onopen = () => {
        console.log("Camera WebSocket connected");
        setIsConnected(true);
        setIsConnecting(false);
      };

      //? Handler per gli errori di connessione
      wsCamInstance.onerror = (error) => {
        console.error("Camera WebSocket error:", error);
        setConnectionError("Failed to connect to the vehicle's camera. Please check if the vehicle is online.");
        setIsConnecting(false);
      };

      //? Handler per i messaggi ricevuti (frame della camera)
      wsCamInstance.onmessage = (event) => {
        //? Converte i dati binari in un'immagine visualizzabile
        if (event.data instanceof ArrayBuffer) {
          const blob = new Blob([event.data], { type: "image/jpeg" });
          setCameraFeed(URL.createObjectURL(blob));
        }
      };

      //? Handler per la chiusura della connessione
      wsCamInstance.onclose = () => {
        console.log("Camera WebSocket disconnected");
        setIsConnected(false);
      };

      setWsCam(wsCamInstance);

      //? Connessione al WebSocket di controllo
      const wsCtrlInstance = new WebSocket(`${protocol}${ipAddress}:81/wsControl`);

      wsCtrlInstance.onopen = () => console.log("Control WebSocket connected");
      wsCtrlInstance.onerror = (error) => console.error("Control WebSocket error:", error);
      wsCtrlInstance.onclose = () => console.log("Control WebSocket disconnected");

      setWsControl(wsCtrlInstance);
    } catch (error) {
      //! Gestione degli errori di connessione
      console.error("Error connecting to vehicle:", error);
      setConnectionError("Failed to connect to the vehicle. Please check if the vehicle is online.");
      setIsConnecting(false);
    }
  };

  //? Funzione per inviare comandi al veicolo
  const sendCommand = (cmd: string) => {
    if (wsControl?.readyState === WebSocket.OPEN) {
      wsControl.send(cmd);
    }
  };

  //? Handler per il movimento del joystick
  const handleJoystickMove = (event: IJoystickUpdateEvent) => {
    const { x, y } = event;
    //? Converte i valori del joystick in comandi
    if (y !== null && y > 0.5) sendCommand("go");
    else if (y !== null && y < -0.5) sendCommand("back");
    else if (x !== null && x < -0.5) sendCommand("left");
    else if (x !== null && x > 0.5) sendCommand("right");
    else sendCommand("stop");
  };

  //? Handler per quando il joystick viene rilasciato
  const handleJoystickStop = () => {
    sendCommand("stop");
  };

  //? Rendering del controller
  return (
    <div className="space-y-6">
      <Card className="overflow-hidden">
        <CardHeader>
          <CardTitle>{vehicle.name}</CardTitle>
          <CardDescription>
            Connected to {vehicle.ipAddress}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0 aspect-video flex items-center justify-center bg-black/5 dark:bg-white/5">
          {isConnecting ? (
            <div className="flex flex-col items-center justify-center text-center p-8">
              <Loader2 className="h-8 w-8 animate-spin mb-4" />
              <p>Connecting to vehicle...</p>
            </div>
          ) : connectionError ? (
            <Alert variant="destructive" className="mx-6 my-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Connection Error</AlertTitle>
              <AlertDescription>{connectionError}</AlertDescription>
            </Alert>
          ) : cameraFeed ? (
            <img
              src={cameraFeed}
              alt="Camera Feed"
              className="w-full h-full object-contain"
            />
          ) : (
            <div className="text-center p-8">
              <p>Waiting for camera feed...</p>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row items-center justify-center p-6 gap-6">
          <div className="grid grid-cols-3 gap-2">
            <Button
              variant="outline"
              onClick={() => sendCommand("headlight")}
              disabled={!isConnected}
            >
              Headlight
            </Button>
            <Button
              variant="outline"
              onClick={() => sendCommand("go")}
              className="font-bold"
              disabled={!isConnected}
            >
              ↑
            </Button>
            <Button
              variant="outline"
              onClick={() => sendCommand("taillight")}
              disabled={!isConnected}
            >
              Taillight
            </Button>
            <Button
              variant="outline"
              onClick={() => sendCommand("left")}
              className="font-bold"
              disabled={!isConnected}
            >
              ←
            </Button>
            <Button
              variant="outline"
              onClick={() => sendCommand("stop")}
              disabled={!isConnected}
            >
              Stop
            </Button>
            <Button
              variant="outline"
              onClick={() => sendCommand("right")}
              className="font-bold"
              disabled={!isConnected}
            >
              →
            </Button>
            <Button
              variant="outline"
              onClick={() => sendCommand("hazard")}
              disabled={!isConnected}
            >
              Hazard
            </Button>
            <Button
              variant="outline"
              onClick={() => sendCommand("back")}
              className="font-bold"
              disabled={!isConnected}
            >
              ↓
            </Button>
            <Button
              variant="outline"
              onClick={() => sendCommand("showAnimation")}
              disabled={!isConnected}
            >
              Animate
            </Button>
          </div>

          <div className="flex items-center justify-center">
            <Joystick
              size={100}
              baseColor={theme === "dark" ? "#374151" : "#E5E7EB"}
              stickColor={theme === "dark" ? "#1F2937" : "#D1D5DB"}
              move={handleJoystickMove}
              stop={handleJoystickStop}
              disabled={!isConnected}
            />
          </div>
        </CardFooter>
      </Card>

      {!isConnected && !isConnecting && !connectionError && (
        <div className="flex justify-center">
          <Button onClick={connectToVehicle} disabled={isConnecting}>
            {isConnecting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Connecting...
              </>
            ) : (
              "Connect to Vehicle"
            )}
          </Button>
        </div>
      )}
    </div>
  );
}

//TODO Aggiungere supporto per visualizzazione in modalità fullscreen
