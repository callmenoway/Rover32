import socket
import time
import ntplib
import struct

# === CONFIG ===
ESP32_IP = "192.168.1.14"  # IP ESP32
ESP32_PORT = 3333  # Porta ESP32
NTP_SERVER = 'pool.ntp.org'  # Server NTP

# Funzione per ottenere l'ora esatta dal server NTP
def get_ntp_time():
    client = ntplib.NTPClient()
    try:
        response = client.request(NTP_SERVER, version=3)
        return response.tx_time  # Restituisce l'ora come timestamp Unix
    except Exception as e:
        print(f"❌ Errore sincronizzazione NTP: {e}")
        return None

# Funzione per inviare il comando START all'ESP32
def manda_comando_start():
    try:
        with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
            s.connect((ESP32_IP, ESP32_PORT))
            s.sendall(b'\x01')  # Comando di avvio
            # Stampa l'ora precisa in cui il comando viene inviato
            current_time = time.time()  # Ottieni il tempo corrente con precisione di frazioni di secondo
            formatted_time = time.strftime('%Y-%m-%d %H:%M:%S', time.gmtime(current_time))
            print(f"📤 Comando START inviato all’ESP - Ora invio: {formatted_time} ({current_time:.6f})")
    except Exception as e:
        print(f"❌ Errore invio comando: {e}")

# Funzione per ricevere l'orario dall'ESP32
def ricevi_orario_dall_esp():
    try:
        with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
            s.connect((ESP32_IP, ESP32_PORT))
            data = s.recv(1024)  # Legge la risposta dall'ESP (l'orario)
            print(f"📥 Dati ricevuti: {data} (lunghezza: {len(data)})")  # Log per debug
            if len(data) == 4:  # Se i dati sono lunghi 4 byte (int)
                # Decodifica il timestamp (numero int)
                millis_time = struct.unpack('I', data)[0]  # Usa 'I' per int (4 bytes)
                print(f"⏰ Orario ricevuto dall'ESP in millisecondi: {millis_time}")
                return millis_time
            else:
                print("❌ Dati ricevuti non validi")
                return None
    except Exception as e:
        print(f"❌ Errore ricezione orario dall'ESP: {e}")
        return None

# === MAIN ===
def main():
    # 1. Sincronizzare con il server NTP
    tempo_iniziale = get_ntp_time()
    if tempo_iniziale is None:
        return

    print(f"⏱ Ora iniziale dal server NTP: {time.strftime('%Y-%m-%d %H:%M:%S', time.gmtime(tempo_iniziale))} ({tempo_iniziale:.6f})")

    # 2. Attendere 5 secondi
    print("🕒 Attesa di 5 secondi...")
    time.sleep(5)

    # 3. Inviare il comando START all'ESP32
    manda_comando_start()

    # 4. Ricevere l'orario dall'ESP32
    # 2. Attendere più tempo (ad esempio 10 secondi)
    print("🕒 Attesa di 10 secondi...")
    time.sleep(10)

    tempo_arrivo_esp = ricevi_orario_dall_esp()

    if tempo_arrivo_esp is not None:
        # 5. Calcolare il tempo netto (differenza tra l'ora di invio e l'ora di ricezione)
        tempo_netto = tempo_arrivo_esp / 1000.0 - tempo_iniziale  # Conversione in secondi
        print(f"⏱ Tempo netto (in secondi): {tempo_netto:.6f}")
    else:
        print("❌ Orario non ricevuto dall'ESP.")

if __name__ == "__main__":
    main()
