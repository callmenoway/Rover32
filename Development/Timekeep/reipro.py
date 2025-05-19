import serial
import socket

#---- CONFIG ---------------------------------
SERIAL_PORT = "COM28"           #metti la tua COM
BAUDRATE = 9600                 #BAUDRATE DEL REIPRO
ESP32_IP = "192.168.1.19"       #IP ESP
ESP32_PORT = 3333               #porta ESP
#---------------------------------------------

def manda_comando_start():
    """Funzione che invia un comando START all'ESP32 attraverso una connessione socket."""
    try:
        with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:    #crea un socket TCP
            s.connect((ESP32_IP, ESP32_PORT))                           #connette all'ESP32
            s.sendall(b'\x01')                                          #invia il byte 0x01 (comando START)
            print("📤 Comando START inviato all'ESP")
    except Exception as e:
        print(f"❌ Errore invio comando: {e}")

#apertura seriale
ser = serial.Serial(SERIAL_PORT, BAUDRATE, timeout=1)  #apre la connessione seriale
print(f"In ascolto su {SERIAL_PORT}...")

buffer = b""  #buffer per accumulare i dati in arrivo sulla seriale

try:
    while True:  #loop infinito di ascolto
        if ser.in_waiting:                      #se ci sono dati disponibili sulla seriale
            buffer += ser.read(ser.in_waiting)  #legge tutti i dati disponibili e li aggiunge al buffer
            if b"\r\n" in buffer:               #se nel buffer c'è un fine riga
                lines = buffer.split(b"\r\n")   #divide il buffer in linee
                for line in lines[:-1]:         #processa tutte le linee complete
                    print(f"[LINEA] {line}")
                    if line.startswith(b'\x10R'):  #se la linea inizia con il pattern di START
                        print("START rilevato dal cronometro")
                        manda_comando_start()      #invia il comando START all'ESP32
                buffer = lines[-1]  #mantiene l'ultima linea incompleta nel buffer
except KeyboardInterrupt:  #gestisce l'interruzione da tastiera (Ctrl+C)
    print("uscita")
    ser.close()  #chiude la connessione seriale prima di uscire
