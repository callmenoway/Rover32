import { BookOpenIcon, RocketIcon, WrenchIcon, BugIcon, HelpCircleIcon } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function DocumentationPage() {
  return (
    <div className="container mx-auto p-6">
      <div className="prose max-w-4xl dark:prose-invert">
        <div className="flex items-center gap-2 mb-6">
          <BookOpenIcon className="h-8 w-8" />
          <h1 className="text-3xl font-bold m-0">Rover32 Documentation</h1>
        </div>
        
        <p className="lead text-xl">
          This comprehensive guide will help you understand how to use and configure your Rover32 device.
        </p>
        
        <h2>What is Rover32?</h2>
        <p>
          Rover32 is a versatile robotic platform designed for educational and experimental purposes.
          It provides a flexible architecture for building autonomous robots and remote-controlled vehicles.
        </p>
        
        <h2>Key Features</h2>
        <ul>
          <li>ESP32-based microcontroller with Wi-Fi and Bluetooth connectivity</li>
          <li>Real-time control via web interface</li>
          <li>Expandable sensor array for environmental monitoring</li>
          <li>Programmable movement patterns</li>
          <li>Battery management system with power monitoring</li>
          <li>Over-the-air firmware updates</li>
          <li>Headlights and taillights control</li>
        </ul>
        
        <h2>Getting Started</h2>
        <p>
          To begin using your Rover32 device, follow these simple steps:
        </p>
        
        <ol>
          <li>Charge the battery fully before first use</li>
          <li>Power on the device using the main switch</li>
          <li>Connect to the Rover32 Wi-Fi network (default password: "rover32pass")</li>
          <li>Navigate to http://rover32.local in your web browser</li>
          <li>Follow the on-screen instructions to complete setup</li>
        </ol>
        
        <h2>Hardware Overview</h2>
        <p>
          The Rover32 consists of the following main components:
        </p>
        
        <ul>
          <li><strong>ESP32 Microcontroller</strong>: The brain of the rover, handling all processing and connectivity</li>
          <li><strong>Motor Driver</strong>: Controls the movement of the rover's wheels</li>
          <li><strong>Camera Module</strong>: Provides visual feedback and streaming capabilities</li>
          <li><strong>OLED Display</strong>: Shows status information and animations</li>
          <li><strong>Lighting System</strong>: Includes headlights, taillights, and status indicators</li>
        </ul>
        
        <h2>Control Interface</h2>
        <p>
          The Rover32 can be controlled through:
        </p>
        
        <ul>
          <li>Web interface (accessible via Wi-Fi)</li>
          <li>Mobile application (iOS/Android)</li>
          <li>Programmatic API for custom applications</li>
        </ul>
        
        <div className="flex flex-wrap gap-4 mt-8 mb-8">
          <Button size="lg">
            <RocketIcon className="mr-2 h-4 w-4" />
            Getting Started Guide
          </Button>
          <Button variant="outline" size="lg">
            <WrenchIcon className="mr-2 h-4 w-4" />
            Configuration
          </Button>
          <Button variant="outline" size="lg">
            <BugIcon className="mr-2 h-4 w-4" />
            Troubleshooting
          </Button>
          <Button variant="outline" size="lg">
            <HelpCircleIcon className="mr-2 h-4 w-4" />
            Support
          </Button>
        </div>
      </div>
    </div>
  )
}
