# COME USARE LE API

## LOGIN

Per il login iniziale dove va inserita la api key riferita all'account basta fare richiesta a:
> <https://dominio/api/app/login>

### REQUEST

Con una richiesta **POST** il json sara' questo:

```json
{
    "apiKey": "api-key"
}
```

Il server in caso di chiave **ERRATA** rispondera':

```json
{
    "success": false,
    "message": "Unauthorized: Invalid API key"
}
```

Il server in caso di chiave **CORRETTA** rispondera':

```json
{
    "success": true,
    "message": "Authentication successful",
    "user": {
        "username": "ADMINISTRATOR",
        "vehicles": [
            {
                "name": "Test veicolo online",
                "ipAddress": "127.0.0.1",
                "macAddress": "FF:11:22:33:44:55"
            },
            {
                "name": "Test veicolo off",
                "ipAddress": "191.168.2.1",
                "macAddress": "00:11:22:33:44:55"
            }
        ]
    }
}
```

## DATA

Appena ci colleghiamo ad un veicolo è importante che i dati vengano syncati. Infatti ogni veicolo avrà delle statistiche che vengono aggiornate ogni tot minuti (per esempio ogni 10 minuti). Quindi se per esempio chiudo il programma al minuto 9 e i dati non sono ancora stati inviati perchè mancava 1 minuto è importante che quei dati siano salvati su un json locale dell'applicazione e al connettersi successivo della macchina quei dati devono essere pushati sull'api. Successivamente tutte le richieste saranno ogni tot minuti e basta.

La richiesta **POST** per aggiornare i dati si struttura così:
> <https://dominio/api/app/vehicle/receive>

```json
{
    "apiKey": "api-key",
    "macAddress": "FF:FF:FF:FF:FF:FF",
    "uptimeHours" : 10,
    "controlHours": 20,
    "kilometersDriven": 30
}
```

e la risposta in caso di api key errata sarà

```json
{
    "success": false,
    "message": "Unauthorized: Invalid API key"
}
```

in caso di mac address errato o non appartenente all'account:

```json
{
    "success": false,
    "message": "Unauthorized: Vehicle not found or does not belong to this user"
}
```

in caso di successo:

```json
{
    "success": true,
    "message": "Vehicle stats updated successfully"
}
```

è importante sapere che questa richiesta è incrementale quindi quando aggiorniamo i dati, una volta pushati sull'api si possono resettare e far tornare a 0. Poi è il backend dell'api a occuparsi di sommarli.
