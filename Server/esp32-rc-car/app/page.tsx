"use client";

import { useState, useEffect } from "react";
import JoystickControl from "@/components/JoystickControl";
import VideoStream from "@/components/VideoStream";
import { Input } from "@/components/ui/input";
import { useWebSocketStore } from "@/utils/websocket";
import DarkModeToggle from "@/components/DarkModeToggle";
import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";

export default function Home() {
  const [ip, setIp] = useState("192.168.1.26"); //indirizzo IP di default
  const { status, message } = useWebSocketStore(); //stato websocket
  const [darkMode, setDarkMode] = useState(false); //stato per al darkmode
  const [user, setUser] = useState(null); //stato per l'utente

  useEffect(() => {
    //controlla se l'utente è autenticato
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => setUser(data.user))
      .catch(() => setUser(null));
  }, []);

  const handleLogin = () => {
    window.location.href = "/api/auth/google"; //reindirizza alla pagina di login
  };

  const handleLogout = () => {
    fetch("/api/auth/logout").then(() => setUser(null)); //reindirizza alla pagina di logout
  };

  //gestione login con Google
  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const userInfo = await axios.get("https://www.googleapis.com/oauth2/v3/userinfo", {
          headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
        });
        setUser(userInfo.data); //salva i dati dell'utente
      } catch (error) {
        console.error("Errore durante il login con Google:", error);
      }
    },
    onError: () => {
      console.error("Errore durante il login con Google");
    },
  });

  //gestione logout con Google
  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-r from-purple-500 to-blue-500 text-white">
        <h1 className="text-4xl font-bold mb-4">Benvenuto su Rover32</h1>
        <p className="mb-6">Accedi con il tuo account Google per continuare</p>
        <button
          onClick={() => handleGoogleLogin()}
          className="px-6 py-3 bg-white text-purple-500 font-semibold rounded-lg shadow-md hover:bg-gray-100"
        >
          Login con Google
        </button>
      </div>
    );
  }

  //se l'utente è autenticato mostra la pagina principale
  return (
    <div className="relative flex flex-col items-center space-y-6 p-6">
      <header className="w-full flex justify-between items-center p-4 bg-purple-500 text-white">
      <h1 className="text-3xl font-bold">Rover32</h1> {/* titolo */}
      <div className="flex space-x-2"> 

        {/* DARKMODE */}
        <button
        onClick={() => {
          setDarkMode(!darkMode);
          document.body.classList.toggle("dark-mode");
        }}
        className="px-4 py-2 bg-white text-purple-500 font-semibold rounded-lg shadow-md hover:bg-gray-100"
        >
        {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
        </button>

        {/* LOGOUT */}
        <button
        onClick={handleLogout}
        className="px-4 py-2 bg-white text-purple-500 font-semibold rounded-lg shadow-md hover:bg-gray-100"
        >
        Logout
        </button>
        
      </div>
      </header>

      {/* NOTIFICHE ESP */}
      <div
        className="fixed bottom-4 left-4 p-3 rounded-lg text-white shadow-md"
        style={{
          backgroundColor:
        status === "connected"
          ? "green"
          : status === "error"
          ? "red"
          : "orange",
        }}
      >
        {message}
      </div>

      {/* INPUT IP */}
      <Input
        type="text"
        value={ip}
        onChange={(e) => setIp(e.target.value)}
        placeholder="ESP32 IP Address"
      />
      <VideoStream ip={ip} /> {/* STREAM ESP32 */}
      <JoystickControl ip={ip} /> {/* JOYSTICK  */}
    </div>
  );
}
