"use client";

import { useState, useEffect } from "react";
import { Joystick } from "react-joystick-component";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardFooter } from "@/components/ui/card";
import NotLoggedIn from "@/components/NotLoggedIn";

export default function ClientHome({ session }: { session: any }) {
    const [ipAddress, setIpAddress] = useState<string>("");
    const [cameraFeed, setCameraFeed] = useState<string | null>(null);
    const [wsControl, setWsControl] = useState<WebSocket | null>(null);
    const [wsCam, setWsCam] = useState<WebSocket | null>(null);
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
    setIsClient(true);
    }, []);

    const connectWebSockets = () => {
        if (!ipAddress) {
          //alert("Inserisci l'indirizzo IP!");
        console.error("❌ Inserire l'indirizzo ip!");
        return;
        }
        const protocol = window.location.protocol === "https:" ? "wss://" : "ws://";
        const wsCamInstance = new WebSocket(`${protocol}${ipAddress}/wsCam`);
        wsCamInstance.binaryType = "arraybuffer";

        wsCamInstance.onmessage = (event) => {
        if (event.data instanceof ArrayBuffer) {
            const blob = new Blob([event.data], { type: "image/jpeg" });
            setCameraFeed(URL.createObjectURL(blob));
        }
        };
        wsCamInstance.onclose = () => console.log("Camera WebSocket disconnected");
        setWsCam(wsCamInstance);

        const wsCtrlInstance = new WebSocket(`${protocol}${ipAddress}:81/wsControl`);
        wsCtrlInstance.onopen = () => console.log("Control WebSocket connected");
        wsCtrlInstance.onclose = () => console.log("Control WebSocket disconnected");
        setWsControl(wsCtrlInstance);
    };

    const sendCommand = (cmd: string) => {
        if (wsControl?.readyState === WebSocket.OPEN) {
        wsControl.send(cmd);
        }
    };

    const handleJoystickMove = (event: any) => {
        const { x, y } = event;
        if (y > 0.5) sendCommand("go");
        else if (y < -0.5) sendCommand("back");
        else if (Math.abs(x) > 0.5) {
        const angle = x > 0 ? 180 : 0;
        sendCommand(`steer:${angle}`);
        } else {
        sendCommand("stop");
        }
        //mettere che se va avanti poco goslow websocket
    };

    const handleJoystickStop = () => {
        sendCommand("stop");
    };

    if (!isClient) {
        return <div className="flex items-center justify-center min-h-screen">Caricamento...</div>;
    }

    if (!session?.user) {
        return <NotLoggedIn />;
    }

    return (
        <div
            className="flex flex-col items-center justify-center min-h-screen bg-gray-50"
            style={{ backgroundImage: "url('/rover32.png')", backgroundSize: "cover", backgroundPosition: "center" }}
        >
            {/* <h2 className="text-2xl">Dashboard - welcome back {session?.user.username}</h2> */}
            <Card className="w-full max-w-md shadow-lg">
            <CardHeader>
                <h1 className="text-2xl font-bold text-center">Rover32</h1>
            </CardHeader>
            <div className="p-4">
                <div className="mb-4">
                <label className="block mb-2 font-semibold">Indirizzo IP:</label>
                <Input
                    type="text"
                    value={ipAddress}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setIpAddress(e.target.value)}
                    placeholder="Esempio: 192.168.1.100"
                    className="w-full"
                />
                </div>
                <Button onClick={connectWebSockets} className="w-full">
                Connetti
                </Button>
            </div>
            <CardFooter>
                <div className="mb-4">
                {cameraFeed ? (
                    <img src={cameraFeed} alt="Camera Feed" className="rounded shadow w-full" />
                ) : (
                    <p className="text-center text-gray-500">Caricamento camera...</p>
                )}
                </div>
                <div className="flex flex-col items-center">
                <Joystick
                    size={100}
                    baseColor="#ccc"
                    stickColor="#333"
                    move={handleJoystickMove}
                    stop={handleJoystickStop}
                />
                <div className="mt-4 flex space-x-2">
                    <Button onClick={() => sendCommand("go")} className="bg-green-500 hover:bg-green-600">
                    Avanti
                    </Button>
                    <Button onClick={() => sendCommand("back")} className="bg-red-500 hover:bg-red-600">
                    Indietro
                    </Button>
                    <Button onClick={() => sendCommand("stop")} className="bg-gray-500 hover:bg-gray-600">
                    Stop
                    </Button>
                </div>
                </div>
            </CardFooter>
            </Card>
        </div>
    );
}