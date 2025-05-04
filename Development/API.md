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

Per aggiornare i dati nel db basta fare 1 richiesta di get all'inizio quando ci colleghiamo al veicolo e ogni tot secondi fare una richiesta post sul db per aggiornare i dati. quando facciamo la richiesta GET è importante salvare i dati su un .json e ogni volta che si aggiornano aggiornarli li in modo che quando ogni tot secondi facciamo la richiesta POST per aggiornare i dati nel db basta che importa il json del veicolo.

La richiesta **POST** per aggiornare i dati si struttura così:

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
