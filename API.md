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
    "success": false,
    "message": "Unauthorized: Invalid API key"
}
```
