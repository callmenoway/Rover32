import serial
import socket
import threading

# === CONFIGURAZIONE ===
SERIAL_PORT = "COM28"
BAUDRATE = 9600
ESP32_IP = "192.168.1.14"
ESP32_PORT = 3333
PC_LISTEN_PORT = 4444  # Dove il PC riceve la risposta dell’ESP

# === FUNZIONE PER INVIARE IL COMANDO TCP ALL’ESP ===
def manda_tcp(ip, porta, dati=b'\x01'):
    try:
        with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
            s.connect((ip, porta))
            s.sendall(dati)
            print(f"✔️ Comando inviato a {ip}:{porta}")
    except Exception as e:
        print(f"❌ Errore invio TCP: {e}")

# === THREAD TCP LISTENER PER RICEVERE LA RISPOSTA DALL’ESP ===
def ascolta_risposta(seriale):
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as server:
        server.bind(('0.0.0.0', PC_LISTEN_PORT))
        server.listen(1)
        print(f"🟡 In attesa di risposta dall’ESP su porta {PC_LISTEN_PORT}...")

        conn, addr = server.accept()
        with conn:
            print(f"✅ Risposta ricevuta da {addr}")
            data = conn.recv(1)
            if data:
                print(">>> STOP <<<")
                # INVIA IMPULSO AL CRONOMETRO
                seriale.write(b'\x10')  # o qualsiasi comando per chiudere circuito
                print("🔴 Impulso STOP inviato al cronometro")

# === AVVIO PROGRAMMA PRINCIPALE ===
ser = serial.Serial(SERIAL_PORT, BAUDRATE, timeout=1)
print(f"In ascolto su {SERIAL_PORT}...")

buffer = b""

try:
    while True:
        if ser.in_waiting:
            buffer += ser.read(ser.in_waiting)
            if b"\r\n" in buffer:
                lines = buffer.split(b"\r\n")
                for line in lines[:-1]:
                    print(f"[LINEA] {line}")
                    if line.startswith(b'\x10R'):
                        print(">>> START rilevato! <<<")

                        # 1. Manda comando all’ESP
                        manda_tcp(ESP32_IP, ESP32_PORT)

                        # 2. Avvia ascolto in background della risposta
                        listener_thread = threading.Thread(target=ascolta_risposta, args=(ser,))
                        listener_thread.start()

                buffer = lines[-1]

except KeyboardInterrupt:
    print("\nInterrotto.")
    ser.close()
