# Rover32 API Sequence Diagrams

This document contains UML sequence diagrams for the key API flows in the Rover32 system.

## 1. User Registration Flow

```mermaid
sequenceDiagram
    participant Client
    participant API_Register as /api/register
    participant Auth_Service as Authentication Service
    participant DB as Database

    Client->>API_Register: POST /api/register {username, email, password}
    Note over API_Register: Validate input using zod
    API_Register->>DB: Check if email exists
    DB->>API_Register: Return result
    
    alt Email already exists
        API_Register->>Client: 409 User with this email already exists
    else Email available
        API_Register->>DB: Check if username exists
        DB->>API_Register: Return result
        
        alt Username already exists
            API_Register->>Client: 409 User with this username already exists
        else Username available
            API_Register->>Auth_Service: Hash password with bcrypt
            Auth_Service->>API_Register: Return hashed password
            API_Register->>DB: Create user record
            DB->>API_Register: Return created user
            API_Register->>Client: 201 User created successfully
        end
    end
```

## 2. User Authentication Flow (NextAuth)

```mermaid
sequenceDiagram
    participant Client
    participant NextAuth as /api/auth/[...nextauth]
    participant Auth_Providers as OAuth Providers
    participant Credentials as Credentials Provider
    participant DB as Database

    alt OAuth Authentication
        Client->>NextAuth: GET /api/auth/signin/{provider}
        NextAuth->>Auth_Providers: Redirect to provider
        Auth_Providers->>NextAuth: Callback with profile
        NextAuth->>DB: Find or create user
        NextAuth->>DB: Create/link account
        NextAuth->>Client: Set session cookie & redirect
    else Credential Authentication
        Client->>NextAuth: POST /api/auth/callback/credentials
        Note over NextAuth: Extract email, password, captchaToken
        NextAuth->>Auth_Providers: Verify captcha token
        
        alt Captcha verification fails
            NextAuth->>Client: Error: CAPTCHA verification failed
        else Captcha verification succeeds
            NextAuth->>DB: Find user by email
            
            alt User not found
                NextAuth->>Client: Error: Invalid email or password
            else User found
                NextAuth->>Credentials: Compare password with bcrypt
                
                alt Password doesn't match
                    NextAuth->>Client: Error: Invalid email or password
                else Password matches
                    NextAuth->>Client: Set session cookie & redirect
                end
            end
        end
    end
```

## 3. Vehicle Management Flow

```mermaid
sequenceDiagram
    participant Client
    participant API_Vehicles as /api/vehicles
    participant Session as Session Service
    participant DB as Database

    %% GET all vehicles
    Client->>API_Vehicles: GET /api/vehicles
    API_Vehicles->>Session: Get user session
    Session->>API_Vehicles: Return session
    
    alt No authenticated session
        API_Vehicles->>Client: 401 Unauthorized
    else Session valid
        API_Vehicles->>DB: Find vehicles for user
        DB->>API_Vehicles: Return vehicles
        API_Vehicles->>Client: 200 {vehicles: [...]}
    end

    %% POST new vehicle
    Client->>API_Vehicles: POST /api/vehicles {name, ipAddress, macAddress}
    API_Vehicles->>Session: Get user session
    Session->>API_Vehicles: Return session
    
    alt No authenticated session
        API_Vehicles->>Client: 401 Unauthorized
    else Session valid
        API_Vehicles->>DB: Validate user exists
        DB->>API_Vehicles: Return result
        
        alt User not found
            API_Vehicles->>Client: 404 User not found
        else User found
            Note over API_Vehicles: Validate input with zod schema
            API_Vehicles->>DB: Create vehicle record
            DB->>API_Vehicles: Return created vehicle
            API_Vehicles->>Client: 201 {vehicle: {...}}
        end
    end
```

## 4. API Key Management Flow

```mermaid
sequenceDiagram
    participant Client
    participant API_Keys as /api/api-keys
    participant Session as Session Service
    participant Utils as API Key Generator
    participant DB as Database

    %% GET API Keys
    Client->>API_Keys: GET /api/api-keys
    API_Keys->>Session: Get user session
    Session->>API_Keys: Return session
    
    alt No authenticated session
        API_Keys->>Client: 401 Unauthorized
    else Session valid
        API_Keys->>DB: Find API keys for user
        DB->>API_Keys: Return API keys (no actual key value)
        API_Keys->>Client: 200 {apiKeys: [...]}
    end

    %% Create API Key
    Client->>API_Keys: POST /api/api-keys {name}
    API_Keys->>Session: Get user session
    Session->>API_Keys: Return session
    
    alt No authenticated session
        API_Keys->>Client: 401 Unauthorized
    else Session valid
        Note over API_Keys: Validate input with zod schema
        API_Keys->>Utils: Generate secure API key
        Utils->>API_Keys: Return generated key
        API_Keys->>DB: Create API key record
        DB->>API_Keys: Return created API key
        API_Keys->>Client: 200 {apiKey: {...}} (includes full key value)
    end
```

## 5. Vehicle Statistics Collection Flow

```mermaid
sequenceDiagram
    participant Mobile_App as Mobile App
    participant API_Stats as /api/app/vehicle/receive
    participant DB as Database

    Mobile_App->>API_Stats: POST {apiKey, macAddress, date, uptimeHours, controlHours, kilometersDriven}
    Note over API_Stats: Parse date or use current date
    API_Stats->>DB: Verify API key exists
    DB->>API_Stats: Return API key with user info
    
    alt Invalid API key
        API_Stats->>Mobile_App: 401 Unauthorized: Invalid API key
    else API key valid
        API_Stats->>DB: Find vehicle by MAC address and user
        DB->>API_Stats: Return vehicle or null
        
        alt Vehicle not found
            API_Stats->>Mobile_App: 401 Unauthorized: Vehicle not found
        else Vehicle found
            API_Stats->>DB: Update API key lastUsed timestamp
            API_Stats->>DB: Update vehicle total stats (increment values)
            API_Stats->>DB: Check for existing stats record for date
            DB->>API_Stats: Return existing stats or null
            
            alt Stats record exists
                API_Stats->>DB: Update stats record (increment values)
            else No stats record for date
                API_Stats->>DB: Create new stats record
            end
            
            API_Stats->>Mobile_App: 200 {success: true, message: "Vehicle stats updated successfully"}
        end
    end
```

## 6. Mobile App Authentication Flow

```mermaid
sequenceDiagram
    participant Mobile_App as Mobile App
    participant API_Login as /api/app/login
    participant DB as Database

    Mobile_App->>API_Login: POST {apiKey}
    Note over API_Login: Validate request with zod schema
    API_Login->>DB: Find API key with user and vehicles
    DB->>API_Login: Return API key record or null
    
    alt API key not found
        API_Login->>Mobile_App: 401 Unauthorized: Invalid API key
    else API key valid
        API_Login->>DB: Update API key lastUsed timestamp
        API_Login->>Mobile_App: 200 {success: true, message: "Authentication successful", user: {...}}
    end
```

## 7. Vehicle Statistics Retrieval Flow

```mermaid
sequenceDiagram
    participant Client
    participant API_Stats as /api/vehicles/stats/[id]
    participant Session as Session Service
    participant DB as Database

    Client->>API_Stats: GET /api/vehicles/stats/{vehicleId}?days=30
    API_Stats->>Session: Get user session
    Session->>API_Stats: Return session
    
    alt No authenticated session
        API_Stats->>Client: 401 Unauthorized
    else Session valid
        API_Stats->>DB: Verify vehicle ownership
        DB->>API_Stats: Return vehicle or null
        
        alt Vehicle not found or not owned
            API_Stats->>Client: 404 Vehicle not found or access denied
        else Vehicle ownership verified
            Note over API_Stats: Calculate date range from days parameter
            API_Stats->>DB: Get stats for vehicle in date range
            DB->>API_Stats: Return stats records
            Note over API_Stats: Format stats and fill missing dates
            API_Stats->>Client: 200 {stats: [...]}
        end
    end
```
