const net = require('net');
const WebSocket = require('ws');
const http = require('http');
const url = require('url');

// Configurazione
const WEBSOCKET_PORT = 8080;
const DEFAULT_ESP_PORT_CAM = 8000;
const DEFAULT_ESP_PORT_CONTROL = 8001;

// Crea un server HTTP per gestire le richieste API e WebSocket
const server = http.createServer((req, res) => {
  // Imposta le intestazioni CORS per consentire richieste dal browser
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS, POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Max-Age', '86400'); // 24 ore di cache per i pre-flight
  
  // Gestione della richiesta OPTIONS (pre-flight)
  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }
  
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;
  
  // Endpoint per verificare lo stato del proxy
  if (pathname === '/status') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'online' }));
    return;
  }
  
  // Endpoint per verificare se un veicolo è online
  if (pathname === '/ping') {
    const ipAddress = parsedUrl.query.ip;
    
    if (!ipAddress) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Indirizzo IP mancante' }));
      return;
    }
    
    // Crea una breve connessione TCP per verificare se il dispositivo è raggiungibile
    const tcpClient = new net.Socket();
    const timeout = 2000; // 2 secondi di timeout
    
    // Imposta il timeout
    tcpClient.setTimeout(timeout);
    
    // Gestisci il successo della connessione
    tcpClient.on('connect', () => {
      tcpClient.destroy();
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ online: true, ip: ipAddress }));
    });
    
    // Gestisci gli errori di connessione
    tcpClient.on('error', () => {
      tcpClient.destroy();
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ online: false, ip: ipAddress }));
    });
    
    // Gestisci il timeout
    tcpClient.on('timeout', () => {
      tcpClient.destroy();
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ online: false, ip: ipAddress }));
    });
    
    // Prova a connettersi al dispositivo sulla porta telecamera
    tcpClient.connect(DEFAULT_ESP_PORT_CAM, ipAddress);
    return;
  }
  
  // Pagina di default per le altre richieste
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('TCP-WebSocket Proxy Server\n');
});

// Crea il server WebSocket
const wss = new WebSocket.Server({ server });

// Mappa per tenere traccia delle connessioni attive
const activeConnections = new Map();

// Funzione per creare una connessione TCP
function createTcpConnection(espIp, port, ws, connectionType) {
  console.log(`Connessione TCP creata verso ${espIp}:${port} (${connectionType})`);
  
  const tcpClient = new net.Socket();
  
  // Gestione degli eventi TCP
  tcpClient.on('data', (data) => {
    // Se la connessione WebSocket è ancora aperta, invia i dati
    if (ws.readyState === WebSocket.OPEN) {
      // Per la fotocamera, invia i dati binari direttamente
      if (connectionType === 'camera') {
        ws.send(data);
      } else {
        // Per il controllo, converte i dati in stringhe
        ws.send(data.toString());
      }
    }
  });
  
  tcpClient.on('error', (err) => {
    console.error(`Errore TCP (${connectionType}): ${err.message}`);
    ws.send(JSON.stringify({ error: `Errore connessione TCP: ${err.message}` }));
    tcpClient.destroy();
  });
  
  tcpClient.on('close', () => {
    console.log(`Connessione TCP chiusa (${connectionType})`);
    // Chiudi anche il WebSocket se è ancora aperto
    if (ws.readyState === WebSocket.OPEN) {
      ws.close();
    }
  });
  
  // Connessione al rover ESP32
  tcpClient.connect(port, espIp, () => {
    console.log(`Connesso a ${espIp}:${port} (${connectionType})`);
    ws.send(JSON.stringify({ status: 'connected', type: connectionType }));
  });
  
  return tcpClient;
}

// Gestione delle connessioni WebSocket
wss.on('connection', (ws, req) => {
  const params = url.parse(req.url, true).query;
  const espIp = params.ip || '192.168.1.1'; // IP di default se non specificato
  const connectionId = Date.now().toString(); // ID univoco per questa connessione
  
  // Determina il tipo di connessione (camera o controllo)
  const connectionType = params.type || 'control';
  
  // Gestisci il tipo "ping" in modo speciale - solo per verificare connettività
  if (connectionType === 'ping') {
    console.log(`Richiesta di ping per ${espIp} tramite WebSocket`);
    
    // Crea una connessione TCP temporanea solo per verificare la connettività
    const pingSocket = new net.Socket();
    const timeout = 2000;
    
    pingSocket.setTimeout(timeout);
    
    pingSocket.on('connect', () => {
      console.log(`Ping riuscito per ${espIp}`);
      ws.send(JSON.stringify({ online: true, ip: espIp }));
      pingSocket.destroy();
    });
    
    pingSocket.on('error', (err) => {
      console.log(`Ping fallito per ${espIp}: ${err.message}`);
      ws.send(JSON.stringify({ online: false, ip: espIp, error: err.message }));
      pingSocket.destroy();
    });
    
    pingSocket.on('timeout', () => {
      console.log(`Timeout ping per ${espIp}`);
      ws.send(JSON.stringify({ online: false, ip: espIp, error: 'Timeout' }));
      pingSocket.destroy();
    });
    
    // Tenta la connessione sulla porta camera
    pingSocket.connect(DEFAULT_ESP_PORT_CAM, espIp);
    
    // Non registrare questa come una connessione attiva persistente
    return;
  }
  
  const port = connectionType === 'camera' ? DEFAULT_ESP_PORT_CAM : DEFAULT_ESP_PORT_CONTROL;
  
  console.log(`Nuova connessione WebSocket: ${connectionType} per ${espIp}:${port}`);
  
  // Crea la connessione TCP
  const tcpClient = createTcpConnection(espIp, port, ws, connectionType);
  
  // Registra la connessione
  activeConnections.set(connectionId, { ws, tcpClient, connectionType });
  
  // Gestione messaggi dal client WebSocket
  ws.on('message', (message) => {
    // Se la connessione TCP è attiva, inoltra il messaggio
    if (tcpClient && !tcpClient.destroyed) {
      if (connectionType === 'control') {
        // Per i comandi di controllo, aggiungi un terminatore di linea
        tcpClient.write(message + '\n');
        console.log(`Comando inviato: ${message}`);
      } else {
        // Per la camera, invia i dati binari così come sono
        tcpClient.write(message);
      }
    }
  });
  
  // Pulizia quando il WebSocket si chiude
  ws.on('close', () => {
    console.log(`WebSocket chiuso (${connectionType})`);
    if (tcpClient && !tcpClient.destroyed) {
      tcpClient.destroy();
    }
    activeConnections.delete(connectionId);
  });
  
  // Gestione errori WebSocket
  ws.on('error', (err) => {
    console.error(`Errore WebSocket (${connectionType}): ${err.message}`);
    if (tcpClient && !tcpClient.destroyed) {
      tcpClient.destroy();
    }
    activeConnections.delete(connectionId);
  });
});

// Avvia il server
server.listen(WEBSOCKET_PORT, () => {
  console.log(`TCP-WebSocket Proxy in esecuzione sulla porta ${WEBSOCKET_PORT}`);
  console.log('Utilizzo:');
  console.log(`- Camera: ws://localhost:${WEBSOCKET_PORT}?type=camera&ip=IP_DEL_ROVER`);
  console.log(`- Controllo: ws://localhost:${WEBSOCKET_PORT}?type=control&ip=IP_DEL_ROVER`);
});

// Gestione chiusura graceful
process.on('SIGINT', () => {
  console.log('Arresto del proxy...');
  
  // Chiudi tutte le connessioni attive
  for (const { tcpClient, ws } of activeConnections.values()) {
    if (tcpClient && !tcpClient.destroyed) {
      tcpClient.destroy();
    }
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.close();
    }
  }
  
  // Chiudi il server
  server.close(() => {
    console.log('Proxy terminato correttamente');
    process.exit(0);
  });
});