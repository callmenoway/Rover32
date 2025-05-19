#include <WiFi.h>

const char* ssid = "";      //nome della rete WiFi
const char* password = "";  //password della rete WiFi
const int porta = 3333;     //porta su cui il server ascolta le connessioni

WiFiServer server(porta);
const int RELAY_PIN = 20;           //pin a cui è collegato il relè
const int RELAY_DURATION_MS = 50;   //durata dell'impulso inviato al relè in millisecondi

void setup() {
    Serial.begin(115200);             //inizializza la comunicazione seriale a 115200 baud
    pinMode(RELAY_PIN, OUTPUT);       //configura il pin del relè come uscita
    digitalWrite(RELAY_PIN, LOW);     //imposta il pin del relè a LOW (disattivato) all'avvio

    //inizia la connessione alla rete WiFi
    WiFi.begin(ssid, password);
    //attende finché non è connesso, mostrando dei punti come indicatore di progresso
    while (WiFi.status() != WL_CONNECTED) {
        delay(500);
        Serial.print(".");
    }
    Serial.println();
    Serial.print("connesso ip: ");
    Serial.println(WiFi.localIP());   //mostra l'indirizzo IP assegnato al dispositivo

    server.begin();                   //avvia il server
}

void loop() {
    //verifica se ci sono client che tentano di connettersi
    WiFiClient client = server.available();
    
    //se c'è un client connesso
    if (client && client.connected()) {
        Serial.println("comando ricevuto");
        
        //legge tutti i dati inviati dal client (ma non li utilizza)
        while (client.available()) {
            client.read();
        }
        
        //attiva il relè per la durata specificata
        digitalWrite(RELAY_PIN, HIGH);  //accende il relè
        delay(RELAY_DURATION_MS);       //attende per la durata specificata
        digitalWrite(RELAY_PIN, LOW);   //spegne il relè
        Serial.println("Rele attivato");
        
        //chiude la connessione con il client
        client.stop();
    }
}
