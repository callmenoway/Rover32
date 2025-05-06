import { Card, CardContent } from "@/src/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/src/components/ui/tabs";
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator, BreadcrumbPage } from "@/src/components/ui/breadcrumb";
import { Code } from "lucide-react";

export default function ApiDocumentationPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/docs">Documentation</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>API Reference</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="space-y-4 text-center mb-12">
        <div className="inline-block p-2 bg-primary/10 rounded-full">
          <Code className="h-10 w-10 text-primary" />
        </div>
        <h1 className="text-4xl font-bold tracking-tight">API Reference</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Complete guide to the Rover32 API endpoints and usage
        </p>
      </div>

      <Card className="mb-8 dark:bg-gray-800 dark:border-gray-700">
        <CardContent className="p-6">
          <h2 className="text-2xl font-semibold mb-4 dark:text-white">Introduction</h2>
          
          <p className="mb-4 dark:text-gray-300">
            The Rover32 API provides programmatic access to the platform, allowing applications 
            to authenticate users, retrieve vehicle information, and update vehicle statistics.
            This documentation covers all available endpoints and their usage.
          </p>

          <div className="bg-amber-50 dark:bg-amber-900/30 p-4 rounded-md mb-8 border-l-4 border-amber-400">
            <p className="text-amber-800 dark:text-amber-300">
              All API requests require authentication via an API key that should be included
              in your requests. API keys can be generated in your account settings.
            </p>
          </div>

          <Tabs defaultValue="auth" className="mt-6">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="auth">Authentication</TabsTrigger>
              <TabsTrigger value="stats">Vehicle Statistics</TabsTrigger>
            </TabsList>
            
            <TabsContent value="auth">
              <div className="space-y-8">
                <div>
                  <h3 className="text-xl font-semibold mb-4 dark:text-white">Login</h3>
                  
                  <p className="mb-4 dark:text-gray-300">
                    To authenticate with the API, send your API key to the login endpoint.
                    This will return user information and a list of accessible vehicles.
                  </p>
                
                  <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded mb-4 flex items-center">
                    <span className="font-mono mr-2 px-2 py-1 bg-blue-200 dark:bg-blue-800 rounded text-blue-800 dark:text-blue-200">POST</span>
                    <span className="font-mono text-blue-700 dark:text-blue-300">/api/app/login</span>
                  </div>

                  <h4 className="font-semibold mt-6 mb-2 dark:text-white">Request Body</h4>
                  
                  <div className="bg-gray-900 rounded-md p-4 mb-4 overflow-x-auto">
                    <pre className="text-green-400 font-mono text-sm">
{`{
    "apiKey": "your-api-key"
}`}
                    </pre>
                  </div>

                  <h4 className="font-semibold mt-6 mb-2 dark:text-white">Successful Response (200 OK)</h4>
                  
                  <div className="bg-gray-900 rounded-md p-4 mb-4 overflow-x-auto">
                    <pre className="text-green-400 font-mono text-sm">
{`{
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
}`}
                    </pre>
                  </div>

                  <h4 className="font-semibold mt-6 mb-2 dark:text-white">Error Response (401 Unauthorized)</h4>
                  
                  <div className="bg-gray-900 rounded-md p-4 mb-4 overflow-x-auto">
                    <pre className="text-red-400 font-mono text-sm">
{`{
    "success": false,
    "message": "Unauthorized: Invalid API key"
}`}
                    </pre>
                  </div>
                  
                  <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg border border-gray-200 dark:border-gray-700 mt-6">
                    <h4 className="font-semibold mb-2 dark:text-white">Usage Notes</h4>
                    <ul className="list-disc pl-6 space-y-1 text-sm dark:text-gray-300">
                      <li>The API key should be kept secure and never exposed in client-side code.</li>
                      <li>A successful login returns all vehicles associated with the user account.</li>
                      <li>The IP address returned can be used to establish a direct connection to the vehicle.</li>
                      <li>MAC addresses serve as unique identifiers for vehicles in the system.</li>
                    </ul>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="stats">
              <div className="space-y-8">
                <div>
                  <h3 className="text-xl font-semibold mb-4 dark:text-white">Update Vehicle Statistics</h3>
                  
                  <p className="mb-4 dark:text-gray-300">
                    This endpoint allows applications to update vehicle usage statistics. 
                    The data is incremental and should be sent periodically or when a connection is established after being offline.
                  </p>
                
                  <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded mb-4 flex items-center">
                    <span className="font-mono mr-2 px-2 py-1 bg-blue-200 dark:bg-blue-800 rounded text-blue-800 dark:text-blue-200">POST</span>
                    <span className="font-mono text-blue-700 dark:text-blue-300">/api/app/vehicle/receive</span>
                  </div>

                  <h4 className="font-semibold mt-6 mb-2 dark:text-white">Request Body</h4>
                  
                  <div className="bg-gray-900 rounded-md p-4 mb-4 overflow-x-auto">
                    <pre className="text-green-400 font-mono text-sm">
{`{
    "apiKey": "your-api-key",
    "macAddress": "FF:FF:FF:FF:FF:FF",
    "uptimeHours": 10,
    "controlHours": 20,
    "kilometersDriven": 30
}`}
                    </pre>
                  </div>

                  <h4 className="font-semibold mt-6 mb-2 dark:text-white">Successful Response (200 OK)</h4>
                  
                  <div className="bg-gray-900 rounded-md p-4 mb-4 overflow-x-auto">
                    <pre className="text-green-400 font-mono text-sm">
{`{
    "success": true,
    "message": "Vehicle stats updated successfully"
}`}
                    </pre>
                  </div>

                  <h4 className="font-semibold mt-6 mb-2 dark:text-white">Error Responses</h4>
                  
                  <div className="mb-4">
                    <p className="font-medium dark:text-white">Invalid API Key (401 Unauthorized)</p>
                    <div className="bg-gray-900 rounded-md p-4 mt-2 overflow-x-auto">
                      <pre className="text-red-400 font-mono text-sm">
{`{
    "success": false,
    "message": "Unauthorized: Invalid API key"
}`}
                      </pre>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <p className="font-medium dark:text-white">Invalid Vehicle (404 Not Found)</p>
                    <div className="bg-gray-900 rounded-md p-4 mt-2 overflow-x-auto">
                      <pre className="text-red-400 font-mono text-sm">
{`{
    "success": false,
    "message": "Unauthorized: Vehicle not found or does not belong to this user"
}`}
                      </pre>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg border border-gray-200 dark:border-gray-700 mt-6">
                    <h4 className="font-semibold mb-2 dark:text-white">Implementation Notes</h4>
                    <ul className="list-disc pl-6 space-y-2 text-sm dark:text-gray-300">
                      <li>
                        <strong>Incremental Updates:</strong> Values sent are incremental and will be added to existing totals in the database. You should reset your local counters after a successful update.
                      </li>
                      <li>
                        <strong>Local Storage:</strong> Your application should store statistics locally and send them when a connection becomes available. This ensures no data is lost during offline periods.
                      </li>
                      <li>
                        <strong>Update Frequency:</strong> It&apos;s recommended to update statistics every 10 minutes during active use, and on application startup if there are pending statistics.
                      </li>
                      <li>
                        <strong>Data Types:</strong>
                        <ul className="list-disc pl-6 mt-1">
                          <li><code>uptimeHours</code>: Total hours the vehicle has been powered on</li>
                          <li><code>controlHours</code>: Hours the vehicle has been actively controlled</li>
                          <li><code>kilometersDriven</code>: Distance traveled in kilometers</li>
                        </ul>
                      </li>
                    </ul>
                  </div>
                  
                  <div className="bg-amber-50 dark:bg-amber-900/30 p-4 rounded-md mt-6 border-l-4 border-amber-400">
                    <p className="text-amber-800 dark:text-amber-300">
                      <strong>Important:</strong> After a successful update, you should reset your local counters to zero.
                      The server will handle the accumulation of statistics over time.
                    </p>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
        <h2 className="text-2xl font-semibold mb-4 dark:text-white">Data Flow Architecture</h2>
        
        <p className="mb-6 dark:text-gray-300">
          The following diagram illustrates the data flow between the Rover32 application, 
          the API server, and the vehicle hardware:
        </p>
        
        <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 mb-4">
          <div className="relative overflow-x-auto">
            <pre className="text-xs text-gray-700 dark:text-gray-300 overflow-visible whitespace-pre">
{`┌──────────────────┐                      ┌──────────────────┐                      ┌──────────────────┐
│                  │                      │                  │                      │                  │
│   Flutter App    │                      │   API Server     │                      │   Rover Hardware │
│                  │                      │                  │                      │                  │
└────────┬─────────┘                      └────────┬─────────┘                      └────────┬─────────┘
         │                                         │                                         │
         │ 1. Login with API Key                   │                                         │
         │ ────────────────────────────────────>   │                                         │
         │                                         │                                         │
         │ 2. Return user & vehicle data           │                                         │
         │ <────────────────────────────────────   │                                         │
         │                                         │                                         │
         │                                         │                                         │
         │                                         │                                         │
         │                                         │                                         │
         │                 Direct TCP Connection (Camera & Control)                          │
         │ ◄───────────────────────────────────────────────────────────────────────────────► │
         │                                         │                                         │
         │                                         │                                         │
         │                                         │                                         │
         │ 3. Collect usage statistics             │                                         │
         │ ┌──────────────────┐                    │                                         │
         │ │                  │                    │                                         │
         │ │  Local Storage   │                    │                                         │
         │ │                  │                    │                                         │
         │ └──────────────────┘                    │                                         │
         │                                         │                                         │
         │ 4. Send statistics update               │                                         │
         │ ────────────────────────────────────>   │                                         │
         │                                         │                                         │
         │ 5. Confirmation                         │                                         │
         │ <────────────────────────────────────   │                                         │
         │                                         │                                         │
         │ 6. Reset local counters                 │                                         │
         │ ┌──────────────────┐                    │                                         │
         │ │                  │                    │                                         │
         │ │  Local Storage   │                    │                                         │
         │ │                  │                    │                                         │
         │ └──────────────────┘                    │                                         │`}
            </pre>
          </div>
        </div>
        
        <h3 className="text-xl font-semibold mb-3 mt-6 dark:text-white">Process Overview</h3>
        
        <ol className="list-decimal pl-6 space-y-2 dark:text-gray-300">
          <li>
            <strong>Authentication:</strong> The application authenticates using the API key and receives 
            vehicle information.
          </li>
          <li>
            <strong>Direct Communication:</strong> The application establishes direct TCP socket connections 
            to the rover hardware for control and video streaming (not through the API).
          </li>
          <li>
            <strong>Statistics Collection:</strong> During operation, the application collects usage statistics 
            and stores them locally.
          </li>
          <li>
            <strong>Periodic Updates:</strong> Every 10 minutes, or when reconnecting after being offline, 
            the application sends accumulated statistics to the API.
          </li>
          <li>
            <strong>Data Reset:</strong> After successful transmission, local counters are reset 
            to prevent duplicate data.
          </li>
        </ol>
      </div>
    </div>
  );
}
