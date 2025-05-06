import { Card, CardContent } from "@/src/components/ui/card";
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator, BreadcrumbPage } from "@/src/components/ui/breadcrumb";
import { Layers } from "lucide-react";

export default function AppOverviewPage() {
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
            <BreadcrumbPage>App</BreadcrumbPage>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Overview</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="space-y-4 text-center mb-12">
        <div className="inline-block p-2 bg-primary/10 rounded-full">
          <Layers className="h-10 w-10 text-primary" />
        </div>
        <h1 className="text-4xl font-bold tracking-tight">Application Overview</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          A comprehensive look at the RoverClient application architecture and components
        </p>
      </div>

      <Card className="mb-8 dark:bg-gray-800 dark:border-gray-700">
        <CardContent className="p-6">
          <h2 className="text-2xl font-semibold mb-4 dark:text-white">Purpose and Functionality</h2>
          
          <p className="mb-4 dark:text-gray-300">
            The RoverClient application serves as the control center for the Rover32 robotic platform. It is a desktop 
            application built with Flutter that provides the following core functionalities:
          </p>

          <ul className="list-disc pl-6 mb-6 space-y-2 dark:text-gray-300">
            <li><strong>Real-time Control:</strong> Direct remote control of the rover movement</li>
            <li><strong>Video Streaming:</strong> Live camera feed from the rover&apos;s onboard camera</li>
            <li><strong>Special Functions:</strong> Control of lights, drift modes, and other special features</li>
            <li><strong>Connection Management:</strong> Simplified connection to the rover via TCP/IP</li>
            <li><strong>Multiple Input Methods:</strong> Support for keyboard, on-screen controls, and gamepads</li>
          </ul>

          <h2 className="text-2xl font-semibold mb-4 mt-8 dark:text-white">System Components</h2>
          
          <p className="mb-4 dark:text-gray-300">
            The complete Rover32 system consists of two primary components:
          </p>

          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-lg border border-blue-100 dark:border-blue-900">
              <h3 className="text-lg font-semibold mb-2 text-blue-700 dark:text-blue-300">Flutter Desktop Client</h3>
              <p className="text-sm mb-3 text-blue-600 dark:text-blue-200">Running on Windows, macOS, or Linux</p>
              <ul className="list-disc pl-5 space-y-1 text-blue-600 dark:text-blue-200">
                <li>User interface for control</li>
                <li>Video frame processing and display</li>
                <li>TCP socket client implementation</li>
                <li>Keyboard and gamepad input handling</li>
                <li>Connection management</li>
              </ul>
            </div>

            <div className="bg-green-50 dark:bg-green-900/30 p-4 rounded-lg border border-green-100 dark:border-green-900">
              <h3 className="text-lg font-semibold mb-2 text-green-700 dark:text-green-300">ESP32 Rover Hardware</h3>
              <p className="text-sm mb-3 text-green-600 dark:text-green-200">ESP32 microcontroller with various peripherals</p>
              <ul className="list-disc pl-5 space-y-1 text-green-600 dark:text-green-200">
                <li>OV2640 camera module</li>
                <li>Motor controllers for movement</li>
                <li>TCP socket servers (control and video)</li>
                <li>OLED display for status</li>
                <li>LEDs and other output peripherals</li>
              </ul>
            </div>
          </div>

          <h2 className="text-2xl font-semibold mb-4 mt-8 dark:text-white">Communication Architecture</h2>

          <div className="bg-white dark:bg-gray-900 p-6 rounded-lg border border-gray-200 dark:border-gray-700 mb-6">
            <h3 className="text-xl font-semibold mb-3 dark:text-white">Dual TCP Socket Architecture</h3>
            <p className="mb-4 dark:text-gray-300">
              The application uses two separate TCP socket connections to communicate with the Rover32:
            </p>

            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div className="border rounded p-4 dark:border-gray-700">
                <h4 className="font-semibold mb-2 dark:text-white">Control Socket (Port 8001)</h4>
                <ul className="list-disc pl-5 space-y-1 text-sm dark:text-gray-300">
                  <li>Bidirectional command channel</li>
                  <li>Text-based command protocol</li>
                  <li>Low-bandwidth, high-priority</li>
                  <li>Used for sending movement commands</li>
                  <li>Receives status updates from rover</li>
                </ul>
              </div>

              <div className="border rounded p-4 dark:border-gray-700">
                <h4 className="font-semibold mb-2 dark:text-white">Camera Socket (Port 8000)</h4>
                <ul className="list-disc pl-5 space-y-1 text-sm dark:text-gray-300">
                  <li>Unidirectional data stream</li>
                  <li>Binary protocol with JPEG frames</li>
                  <li>High-bandwidth for video streaming</li>
                  <li>Custom frame headers for synchronization</li>
                  <li>Optimized for low latency</li>
                </ul>
              </div>
            </div>

            <div className="mt-4 bg-gray-50 dark:bg-gray-800 p-4 rounded border border-gray-200 dark:border-gray-700">
              <h4 className="font-semibold mb-2 dark:text-white">Connection Flow</h4>
              <ol className="list-decimal pl-5 space-y-1 text-sm dark:text-gray-300">
                <li>User enters ESP32&apos;s IP address in the application</li>
                <li>App establishes control socket connection to port 8001</li>
                <li>App establishes camera socket connection to port 8000</li>
                <li>Camera frames start streaming automatically once connected</li>
                <li>User can now send control commands through the UI</li>
                <li>On disconnection, both sockets are properly closed</li>
              </ol>
            </div>
          </div>

          <h2 className="text-2xl font-semibold mb-4 mt-8 dark:text-white">Flutter Application Structure</h2>
          
          <p className="mb-4 dark:text-gray-300">
            The RoverClient Flutter application is structured using a provider-based architecture with several core components:
          </p>

          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse dark:text-gray-300">
              <thead>
                <tr className="bg-gray-100 dark:bg-gray-800">
                  <th className="border p-2 text-left dark:border-gray-700">Component</th>
                  <th className="border p-2 text-left dark:border-gray-700">Description</th>
                  <th className="border p-2 text-left dark:border-gray-700">Responsibilities</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border p-2 dark:border-gray-700"><strong>Connection Manager</strong></td>
                  <td className="border p-2 dark:border-gray-700">Handles TCP socket connections</td>
                  <td className="border p-2 dark:border-gray-700">
                    <ul className="list-disc pl-5 text-sm">
                      <li>Establishing/closing connections</li>
                      <li>Socket error handling</li>
                      <li>Connection state management</li>
                    </ul>
                  </td>
                </tr>
                <tr>
                  <td className="border p-2 dark:border-gray-700"><strong>Camera Stream Processor</strong></td>
                  <td className="border p-2 dark:border-gray-700">Processes raw camera data</td>
                  <td className="border p-2 dark:border-gray-700">
                    <ul className="list-disc pl-5 text-sm">
                      <li>Frame parsing and extraction</li>
                      <li>JPEG decoding</li>
                      <li>Image display management</li>
                    </ul>
                  </td>
                </tr>
                <tr>
                  <td className="border p-2 dark:border-gray-700"><strong>Command Controller</strong></td>
                  <td className="border p-2 dark:border-gray-700">Manages control commands</td>
                  <td className="border p-2 dark:border-gray-700">
                    <ul className="list-disc pl-5 text-sm">
                      <li>Command formatting</li>
                      <li>Command transmission</li>
                      <li>Input to command mapping</li>
                    </ul>
                  </td>
                </tr>
                <tr>
                  <td className="border p-2 dark:border-gray-700"><strong>User Interface</strong></td>
                  <td className="border p-2 dark:border-gray-700">Visual components</td>
                  <td className="border p-2 dark:border-gray-700">
                    <ul className="list-disc pl-5 text-sm">
                      <li>Control buttons and joystick</li>
                      <li>Video display widget</li>
                      <li>Connection settings</li>
                      <li>Status indicators</li>
                    </ul>
                  </td>
                </tr>
                <tr>
                  <td className="border p-2 dark:border-gray-700"><strong>Input Handler</strong></td>
                  <td className="border p-2 dark:border-gray-700">Processes user inputs</td>
                  <td className="border p-2 dark:border-gray-700">
                    <ul className="list-disc pl-5 text-sm">
                      <li>Keyboard event processing</li>
                      <li>Gamepad integration</li>
                      <li>Touch/click handling</li>
                    </ul>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <h2 className="text-2xl font-semibold mb-4 mt-8 dark:text-white">Technology Stack</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h3 className="text-xl font-semibold mb-3 dark:text-white">Core Technologies</h3>
              <ul className="list-disc pl-6 space-y-2 dark:text-gray-300">
                <li><strong>Flutter:</strong> Cross-platform UI framework</li>
                <li><strong>Dart:</strong> Programming language</li>
                <li><strong>Provider:</strong> State management</li>
                <li><strong>tcp_socket_connection:</strong> Socket communication</li>
                <li><strong>flutter_joystick:</strong> Virtual joystick control</li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-3 dark:text-white">Additional Libraries</h3>
              <ul className="list-disc pl-6 space-y-2 dark:text-gray-300">
                <li><strong>image:</strong> Image processing</li>
                <li><strong>shared_preferences:</strong> Local settings storage</li>
                <li><strong>flutter_secure_storage:</strong> Secure data storage</li>
                <li><strong>flutter_keyboard_visibility:</strong> Keyboard event handling</li>
                <li><strong>equatable:</strong> Value equality</li>
              </ul>
            </div>
          </div>

          <h2 className="text-2xl font-semibold mb-4 mt-8 dark:text-white">Compatibility</h2>
          
          <p className="mb-4 dark:text-gray-300">
            The RoverClient application is compatible with:
          </p>

          <ul className="list-disc pl-6 mb-6 space-y-2 dark:text-gray-300">
            <li><strong>Operating Systems:</strong> Windows (10+), macOS (10.15+), Linux (Ubuntu 20.04+)</li>
            <li><strong>ESP32 Firmware:</strong> Rover32 firmware version 1.0.0 or higher</li>
            <li><strong>Display Scaling:</strong> Adaptive layout works with various screen sizes and resolutions</li>
            <li><strong>Input Devices:</strong> Keyboard, mouse, touchscreen, and most USB/Bluetooth gamepads</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
