import { create } from "zustand";

//stato per le notifiche WebSocket
interface WebSocketState {
  status: "connected" | "disconnected" | "error";
  message: string;
  setStatus: (status: "connected" | "disconnected" | "error", message: string) => void;
}

export const useWebSocketStore = create<WebSocketState>((set) => ({
  status: "disconnected",
  message: "",
  setStatus: (status, message) => set({ status, message }),
}));

export class WebSocketClient {
  private ws: WebSocket | null = null;
  private ip: string;
  private isConnected: boolean = false; //per evitare riconnessioni inutili
  
  constructor(ip: string) {
    this.ip = ip;
    this.connect();
  }

  connect() {
    if (this.isConnected) return; //se è già connesso, non fa nulla

    try {
      this.ws = new WebSocket(`ws://${this.ip}:81/wsControl`);

      this.ws.onopen = () => {
        console.log("✅ Connected to ESP32");
        if (!this.isConnected) { //gestione solo al primo successo di connessione
          this.isConnected = true;
          useWebSocketStore.getState().setStatus("connected", "✅ Connesso all'ESP32");
        }
      };

      this.ws.onerror = (err) => {
        //console.error("❌ WebSocket Error", err);
        useWebSocketStore.getState().setStatus("error", "⚠️ Errore di connessione con l'ESP32!");
      };

      this.ws.onclose = () => {
        console.warn("⚠️ WebSocket Disconnesso, riprovo...");
        if (this.isConnected) {
          this.isConnected = false;
          useWebSocketStore.getState().setStatus("disconnected", "❌ Disconnesso, tentando di riconnettere...");
          setTimeout(() => this.connect(), 5000);
        }
      };

    } catch (error) {
      console.error("❌ Errore critico nel WebSocket:", error);
      useWebSocketStore.getState().setStatus("error", "🚨 Errore critico nel WebSocket!");
    }
  }

  sendCommand(cmd: string) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(cmd);
    } else {
      console.warn("⚠️ WebSocket non connesso. Comando non inviato:", cmd);
    }
  }

  close() {
    this.ws?.close();
  }
}
