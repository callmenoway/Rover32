import { BookOpenIcon, RocketIcon, WrenchIcon, BugIcon, HelpCircleIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function DocumentationPage() {
  return (
    <div className="container mx-auto py-10 px-4 md:px-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="space-y-4 text-center mb-12">
          <div className="inline-block p-2 bg-primary/10 rounded-full">
            <BookOpenIcon className="h-10 w-10 text-primary" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight">Rover32 Documentation</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Comprehensive guides and references to help you set up and master your Rover32 device
          </p>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-12">
          <Card className="p-4 text-center hover:shadow-md transition-all">
            <RocketIcon className="h-8 w-8 mx-auto mb-2 text-primary" />
            <h3 className="font-medium">Getting Started</h3>
            <p className="text-sm text-muted-foreground">Quick setup guides</p>
          </Card>
          <Card className="p-4 text-center hover:shadow-md transition-all">
            <WrenchIcon className="h-8 w-8 mx-auto mb-2 text-primary" />
            <h3 className="font-medium">Configuration</h3>
            <p className="text-sm text-muted-foreground">Advanced settings</p>
          </Card>
          <Card className="p-4 text-center hover:shadow-md transition-all">
            <BugIcon className="h-8 w-8 mx-auto mb-2 text-primary" />
            <h3 className="font-medium">Troubleshooting</h3>
            <p className="text-sm text-muted-foreground">Common solutions</p>
          </Card>
          <Card className="p-4 text-center hover:shadow-md transition-all">
            <HelpCircleIcon className="h-8 w-8 mx-auto mb-2 text-primary" />
            <h3 className="font-medium">Support</h3>
            <p className="text-sm text-muted-foreground">Get help</p>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="overview" className="mb-12">
          <TabsList className="grid grid-cols-4 mb-8">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="features">Features</TabsTrigger>
            <TabsTrigger value="setup">Setup</TabsTrigger>
            <TabsTrigger value="hardware">Hardware</TabsTrigger>
          </TabsList>
          
            <TabsContent value="overview">
              <div className="space-y-6">
                <h2 className="text-3xl font-bold tracking-tight">What is Rover32?</h2>
                <p className="text-lg text-muted-foreground">
                  Rover32 is an advanced robotics platform built around the ESP32 microcontroller, designed for
                  makers, STEM education, and research applications. It combines powerful hardware capabilities with
                  an intuitive software interface to simplify development of autonomous systems and IoT projects.
                </p>
                <p className="text-lg text-muted-foreground">
                  The platform features a modular architecture that allows for easy expansion with various sensors,
                  actuators, and communication modules. With built-in Wi-Fi and Bluetooth connectivity, Rover32
                  enables wireless control, data logging, and integration with cloud services.
                </p>
                <p className="text-lg text-muted-foreground">
                  From teaching programming concepts to prototyping complex robotic behaviors, Rover32 provides
                  the perfect balance of accessibility for beginners and depth for experienced developers.
                </p>
              </div>
            </TabsContent>
          
          <TabsContent value="features" className="prose dark:prose-invert max-w-none">
          <h2 className="text-3xl font-bold tracking-tight">Key Features</h2>
          <br />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="p-4">
                <h3 className="text-lg font-medium">Connectivity</h3>
                <ul className="mt-2 space-y-1">
                  <li>ESP32-based microcontroller</li>
                  <li>Dual-band Wi-Fi connectivity</li>
                  <li>Bluetooth 4.2 support</li>
                  <li>Over-the-air firmware updates</li>
                </ul>
              </Card>
              <Card className="p-4">
                <h3 className="text-lg font-medium">Control Systems</h3>
                <ul className="mt-2 space-y-1">
                  <li>Real-time web interface control</li>
                  <li>Programmable movement patterns</li>
                  <li>REST API for custom applications</li>
                  <li>Joystick and keyboard support</li>
                </ul>
              </Card>
              <Card className="p-4">
                <h3 className="text-lg font-medium">Sensing & Feedback</h3>
                <ul className="mt-2 space-y-1">
                  <li>Expandable sensor array</li>
                  <li>Environmental monitoring</li>
                  <li>Integrated OLED display</li>
                  <li>Camera module support</li>
                </ul>
              </Card>
              <Card className="p-4">
                <h3 className="text-lg font-medium">Power System</h3>
                <ul className="mt-2 space-y-1">
                  <li>Battery management system</li>
                  <li>Real-time power monitoring</li>
                  <li>USB-C charging</li>
                  <li>Power-saving modes</li>
                </ul>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="setup" className="prose dark:prose-invert max-w-none">
          <h2 className="text-3xl font-bold tracking-tight">Getting Started</h2>
          <br />
            <p>
              Follow these steps to set up your Rover32 device quickly and safely:
            </p>
            
            <ol className="space-y-4 mt-6">
              <li className="flex items-start">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-primary-foreground mr-3 shrink-0">1</span>
                <div>
                  <strong>Charge the battery</strong>
                  <p className="text-muted-foreground">Connect the USB-C cable to charge the battery fully before first use.</p>
                </div>
              </li>
              <li className="flex items-start">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-primary-foreground mr-3 shrink-0">2</span>
                <div>
                  <strong>Power on the device</strong>
                  <p className="text-muted-foreground">Use the main power switch located on the side of the device.</p>
                </div>
              </li>
              <li className="flex items-start">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-primary-foreground mr-3 shrink-0">3</span>
                <div>
                  <strong>Connect to Wi-Fi</strong>
                  <p className="text-muted-foreground">Join the "Rover32" network using the default password "rover32pass".</p>
                </div>
              </li>
              <li className="flex items-start">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-primary-foreground mr-3 shrink-0">4</span>
                <div>
                  <strong>Access the interface</strong>
                  <p className="text-muted-foreground">Open http://rover32.local in your web browser to access the control panel.</p>
                </div>
              </li>
              <li className="flex items-start">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-primary-foreground mr-3 shrink-0">5</span>
                <div>
                  <strong>Complete configuration</strong>
                  <p className="text-muted-foreground">Follow the on-screen instructions to complete the initial setup.</p>
                </div>
              </li>
            </ol>
          </TabsContent>

          <TabsContent value="hardware" className="prose dark:prose-invert max-w-none">
          <h2 className="text-3xl font-bold tracking-tight">Hardware Overview</h2>
          <br />
            <p>
              The Rover32 platform integrates several key components to deliver a robust and versatile robotics experience:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              <Card className="p-4 flex flex-col h-full">
                <h3 className="text-lg font-medium mb-2">ESP32 Microcontroller</h3>
                <p className="text-muted-foreground flex-grow">The central processing unit that manages all device operations, connectivity, and sensor integration.</p>
              </Card>
              <Card className="p-4 flex flex-col h-full">
                <h3 className="text-lg font-medium mb-2">Motor Driver</h3>
                <p className="text-muted-foreground flex-grow">Precision control system for the rover's motors, enabling accurate movement and positioning.</p>
              </Card>
              <Card className="p-4 flex flex-col h-full">
                <h3 className="text-lg font-medium mb-2">Camera Module</h3>
                <p className="text-muted-foreground flex-grow">Optional visual feedback system that enables streaming, object detection, and navigation assistance.</p>
              </Card>
              <Card className="p-4 flex flex-col h-full">
                <h3 className="text-lg font-medium mb-2">OLED Display</h3>
                <p className="text-muted-foreground flex-grow">Integrated screen for status information, diagnostics, and custom animations.</p>
              </Card>
              <Card className="p-4 flex flex-col h-full">
                <h3 className="text-lg font-medium mb-2">Lighting System</h3>
                <p className="text-muted-foreground flex-grow">Programmable LEDs for headlights, taillights, and status indicators with multiple patterns.</p>
              </Card>
              <Card className="p-4 flex flex-col h-full">
                <h3 className="text-lg font-medium mb-2">Battery System</h3>
                <p className="text-muted-foreground flex-grow">Rechargeable LiPo battery with integrated management system and status monitoring.</p>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
