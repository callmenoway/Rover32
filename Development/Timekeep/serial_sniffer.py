import serial
import serial.tools.list_ports

def list_serial_ports():
    ports = serial.tools.list_ports.comports()
    return [port.device for port in ports]

print("Porte seriali disponibili:")
ports = list_serial_ports()
for i, port in enumerate(ports):
    print(f"[{i}] {port}")

index = int(input("Scegli il numero della porta da monitorare: "))
selected_port = ports[index]

# Configura i parametri seriali. Prova con 9600 baud, 8N1 (standard tipico)
ser = serial.Serial(selected_port, baudrate=9600, timeout=1)

print(f"\nIn ascolto sulla porta {selected_port}...\nPremi CTRL+C per uscire.\n")

try:
    while True:
        if ser.in_waiting:
            data = ser.read(ser.in_waiting)
            print(f"Dato ricevuto: {data} / Testo: {data.decode(errors='ignore')}")
except KeyboardInterrupt:
    print("\nUscita.")
    ser.close()
