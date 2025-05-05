import serial
import time

# Config porta seriale
ser = serial.Serial("COM28", 9600, timeout=1)
time.sleep(2)  # attesa inizializzazione

# Lista di comandi di test
comandi_test = [
    b'\x10T\r\n',
    b'STOP\r\n',
    b'\x10S\r\n',
    b'\x02STOP\x03\r\n',
    b'\x10\x02STP\x10\x03\r\n'
]

for cmd in comandi_test:
    print(f"Invio: {cmd}")
    ser.write(cmd)
    time.sleep(1)

ser.close()
