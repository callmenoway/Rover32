import { Button } from "@/src/components/ui/button";
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator, BreadcrumbPage } from "@/src/components/ui/breadcrumb";

export default function DocumentationPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
        <BreadcrumbLink href="/">Home</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
        <BreadcrumbPage>Documentation</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
      </Breadcrumb>

      <h1 className="text-4xl font-bold mb-6">Rover32 Documentation</h1>

      <div className="bg-amber-50 p-4 rounded-md mb-8 border-l-4 border-amber-400">
      <p className="text-amber-800">
        This documentation provides comprehensive details about the Rover32 robotic platform, 
        including hardware specifications, software architecture, and integration guides.
      </p>
      </div>

      <h2 className="text-2xl font-semibold mb-4">Overview</h2>
      <p className="mb-4">
      Rover32 is a versatile ESP32-based robotic platform that combines real-time video streaming, 
      remote control capabilities, and a clean web interface for management and analytics.
      </p>

      <ul className="list-disc pl-6 mb-6 space-y-2">
      <li><strong>ESP32 Microcontroller</strong>: The brain of the rover, handling all processing and connectivity</li>
      <li><strong>Motors</strong>: Controls the movement of the rover&apos;s wheels</li>
      <li><strong>Camera Module</strong>: Provides visual feedback and streaming capabilities</li>
      <li><strong>OLED Display</strong>: Shows status information and animations</li>
      <li><strong>Lighting System</strong>: Includes headlights, taillights, and status indicators</li>
      </ul>

      <h2 className="text-2xl font-semibold mt-8 mb-4">Technical Architecture</h2>
      <p className="mb-4">
      The Rover32 system consists of multiple integrated components:
      </p>
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 mb-8">
        <h3 className="text-xl font-semibold mb-3 dark:text-white">System Components</h3>
        <ul className="list-disc pl-6 space-y-2">
          <li>
          <strong className="dark:text-white">ESP32 Firmware</strong>: <span className="dark:text-gray-300">Written in C++ using the Platform IO,
          the firmware manages camera capture, motor control, and TCP communication</span>
          </li>
          <li>
          <strong className="dark:text-white">TCP Protocol</strong>: <span className="dark:text-gray-300">Raw TCP sockets used for direct communication with minimal overhead,
          providing both camera streaming (port 8000) and control commands (port 8001)</span>
          </li>
          <li>
          <strong className="dark:text-white">PC Flutter Application</strong>: <span className="dark:text-gray-300">Cross-platform desktop application written in Flutter for
          controlling the Rover32, viewing camera feed, and managing settings</span>
          </li>
          <li>
          <strong className="dark:text-white">Web API</strong>: <span className="dark:text-gray-300">RESTful API service for user authentication, statistics gathering, and
          account management</span>
          </li>
        </ul>
      </div>

      <h2 className="text-2xl font-semibold mt-8 mb-4">Control Interface</h2>
      <p className="mb-4">
      The Rover32 can be controlled primarily through:
      </p>

      <ul className="list-disc pl-6 mb-6 space-y-2">
      <li><strong>PC Flutter Application</strong>: Desktop application offering full control and video streaming</li>
      <li><strong>Web Interface</strong>: For account management and statistics (not direct robot control)</li>
      <li><strong>Programmatic API</strong>: For developers creating custom control applications</li>
      </ul>

      <div className="flex flex-wrap gap-4 mt-8 mb-8">
      <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
        <a href="/docs/quickstart" className="text-white font-medium no-underline">Quickstart Guide</a>
      </Button>
      <Button variant="outline" size="lg">
        <a href="https://github.com/callmenoway/rover32" className="text-blue-600 font-medium no-underline">GitHub Repository</a>
      </Button>
      </div>

      <h2 className="text-2xl font-semibold mt-10 mb-6">Technology Stack</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
        <h3 className="text-xl font-semibold mb-3 text-blue-700 dark:text-blue-400">Hardware</h3>
        <ul className="list-disc pl-5 space-y-2">
        <li>
          <strong className="dark:text-white">ESP32 Microcontroller</strong><br/>
          <span className="text-gray-600 dark:text-gray-300">Powerful dual-core processor with Wi-Fi and Bluetooth capabilities. Available in WROVER Kit and ESP32-S3 variants.</span>
        </li>
        <li>
          <strong className="dark:text-white">OV2640 Camera</strong><br/>
          <span className="text-gray-600 dark:text-gray-300">2MP camera with JPEG compression for efficient streaming.</span>
        </li>
        <li>
          <strong className="dark:text-white">SSD1306 OLED Display</strong><br/>
          <span className="text-gray-600 dark:text-gray-300">128x32 monochrome display for status information.</span>
        </li>
        <li>
          <strong className="dark:text-white">L298N Motor Driver</strong><br/>
          <span className="text-gray-600 dark:text-gray-300">Dual H-bridge motor controller for precise movement.</span>
        </li>
        </ul>
      </div>
      
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
        <h3 className="text-xl font-semibold mb-3 text-blue-700 dark:text-blue-400">Software</h3>
        <ul className="list-disc pl-5 space-y-2">
        <li>
          <strong className="dark:text-white">ESP-IDF & Arduino</strong><br/>
          <span className="text-gray-600 dark:text-gray-300">Firmware development framework with Arduino compatibility layer.</span>
        </li>
        <li>
          <strong className="dark:text-white">FreeRTOS</strong><br/>
          <span className="text-gray-600 dark:text-gray-300">Real-time operating system for task management on ESP32.</span>
        </li>
        <li>
          <strong className="dark:text-white">Flutter</strong><br/>
          <span className="text-gray-600 dark:text-gray-300">Cross-platform framework for desktop application development.</span>
        </li>
        <li>
          <strong className="dark:text-white">Next.js & React</strong><br/>
          <span className="text-gray-600 dark:text-gray-300">Web framework for the administration portal and API services.</span>
        </li>
        <li>
          <strong className="dark:text-white">TCP Socket Communication</strong><br/>
          <span className="text-gray-600 dark:text-gray-300">Raw TCP sockets for efficient, low-latency data transfer.</span>
        </li>
        </ul>
      </div>
      </div>
    </div>
  );
}
