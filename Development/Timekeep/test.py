import serial     # Importa la libreria per comunicare attraverso la porta seriale
import socket     # Importa la libreria per comunicazioni di rete

#---- CONFIG ---------------------------------
SERIAL_PORT = "COM28"           # <-- metti la tua COM
BAUDRATE = 9600                 # BAUDRATE DEL REIPRO
ESP32_IP = "192.168.1.19"       # IP ESP
ESP32_PORT = 3333               # Porta ESP
#---------------------------------------------

def manda_comando_start():
    try:
        with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
            s.connect((ESP32_IP, ESP32_PORT))
            s.sendall(b'\x01')
            print("📤 Comando START inviato all’ESP")
    except Exception as e:
        print(f"❌ Errore invio comando: {e}")

#apertura seriale
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
                        print("🚦 START rilevato dal cronometro!")
                        manda_comando_start()
                buffer = lines[-1]
except KeyboardInterrupt:
    print("👋 Uscita.")
    ser.close()
