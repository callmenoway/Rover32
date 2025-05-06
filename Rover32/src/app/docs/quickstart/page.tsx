import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator } from "@/src/components/ui/breadcrumb";

export default function QuickstartPage() {
    return (
        <div className='container mx-auto py-10 px-4 md:px-6'>
            <div className='max-w-5xl mx-auto'></div>
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
                            <BreadcrumbLink href="/docs/quickstart">Quickstart</BreadcrumbLink>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>

            <div className="flex flex-1">
                <main className="flex-1 p-6 max-w-3xl mx-auto">
                    <h1 className="text-3xl font-bold mb-6">Quickstart Guide</h1>
                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold mb-4">Prerequisites</h2>
                        <ul className="list-disc pl-6 space-y-2 mb-4">
                            <li>ESP32-S3-CAM module</li>
                            <li>3D printed chassis parts</li>
                            <li>1 20uF capacitor</li>
                            <li>2 headlight LEDs</li>
                            <li>2 taillight LEDs</li>
                            <li>2 18650 lithium-ion batteries</li>
                            <li>DC-DC converter (set to 8V)</li>
                            <li>L7805CV voltage regulator</li>
                            <li>9g micro servo</li>
                            <li>2 DC motors</li>
                            <li>1 motor controller</li>
                            <li>4 wheels</li>
                        </ul>
                    </section>

                    <div className="mb-6">
                        <div className="flex p-4 mb-4 border border-green-500/30 bg-green-500/10 rounded-xl backdrop-blur-sm">
                            <svg className="w-5 h-5 text-green-400 mr-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <div>
                                <h4 className="text-green-700 font-medium">Tip</h4>
                                <p className="text-green-600 text-sm">For best performance, use high-quality 18650 batteries with at least 2500mAh capacity.</p>
                            </div>
                        </div>
                    </div>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold mb-4">Installation</h2>
                        <p className="mb-4">
                            Before starting, ensure your ESP32 is a dual-core version as our code is designed for multi-core processors.
                        </p>
                        <div className="mb-6">
                            <div className="flex p-4 mb-4 border border-yellow-500/30 bg-yellow-500/10 rounded-xl backdrop-blur-sm">
                                <svg className="w-5 h-5 text-yellow-400 mr-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                                <div>
                                    <h4 className="text-yellow-400 font-medium">Warning</h4>
                                    <p className="text-yellow-300 text-sm">Incorrect wiring may damage your ESP32 or other components.</p>
                                </div>
                            </div>
                        </div>

                        <h3 className="text-xl font-medium mb-2">Step 1: Download the firmware</h3>

                        <div className="mb-6">
                            <div className="flex p-4 mb-4 border border-blue-500/30 bg-blue-500/10 rounded-xl backdrop-blur-sm">
                                <svg className="w-5 h-5 text-blue-400 mr-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <div>
                                    <h4 className="text-blue-400 font-medium">Note</h4>
                                    <p className="text-blue-300 text-sm">Make sure to download the correct firmware version for your ESP32 model.</p>
                                </div>
                            </div>
                        </div>

                        <p className="mb-4">
                            Download the latest release from our GitHub repository or clone it using:
                        </p>
                        <div className="bg-zinc-900 text-zinc-100 p-3 rounded-md mb-4 font-mono text-sm">
                            <code>git clone https://github.com/callmenoway/Rover32.git</code>
                        </div>

                        <h3 className="text-xl font-medium mb-2">Step 2: Configure and flash the firmware</h3>
                        <ol className="list-decimal pl-6 space-y-2 mb-4">
                            <li>Navigate to the Firmware folder and open it in PlatformIO</li>
                            <li>Update the WiFi password in <code className="bg-zinc-100 px-1 py-0.5 rounded text-zinc-900">config.cpp</code></li>
                            <li>Verify your configuration settings in <code className="bg-zinc-100 px-1 py-0.5 rounded text-zinc-900">config.h</code></li>
                            <li>Flash the firmware to your ESP32</li>
                        </ol>
                        
                        <h3 className="text-xl font-medium mb-2">Step 3: Register your vehicle</h3>
                        <ol className="list-decimal pl-6 space-y-2 mb-4">
                            <li>Go to the &quot;Manage Vehicle&quot; section on our website</li>
                            <li>Create a new vehicle entry with the correct IP and MAC addresses</li>
                            <li>Generate an API key for rover statistics in the &quot;Manage API Keys&quot; section</li>
                            <li>Open the application in the App/release folder</li>
                            <li>Enter the API key you&apos;ve copied to complete the setup</li>
                        </ol>
                    </section>
                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold mb-4">Basic Usage</h2>
                        <p className="mb-4">
                            Once you&apos;ve logged into the app using your API key, you&apos;ll have full control over your Rover32, 
                            including keyboard controls. All rover performance data and usage statistics are automatically recorded.
                        </p>
                        <p className="mb-4">
                            To view your vehicle&apos;s statistics, visit:
                            <a href="https://rover32.davidecose.com/vehicles" className="text-blue-600 hover:underline ml-1">
                                https://rover32.davidecose.com/vehicles
                            </a>
                            <br />
                            and click the &quot;Statistics&quot; button next to your registered vehicle.
                        </p>
                    </section>
                </main>
            </div>
        </div>
    );
}