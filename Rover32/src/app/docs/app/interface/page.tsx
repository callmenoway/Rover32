import { Card, CardContent } from "@/src/components/ui/card";
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator, BreadcrumbPage } from "@/src/components/ui/breadcrumb";
import { Monitor } from "lucide-react";

export default function AppInterfacePage() {
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
            <BreadcrumbPage>Interface</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="space-y-4 text-center mb-12">
        <div className="inline-block p-2 bg-primary/10 rounded-full">
          <Monitor className="h-10 w-10 text-primary" />
        </div>
        <h1 className="text-4xl font-bold tracking-tight">User Interface</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Understanding the RoverClient interface layout and control elements
        </p>
      </div>

      <Card className="mb-8 dark:bg-gray-800 dark:border-gray-700">
        <CardContent className="p-6">
          <h2 className="text-2xl font-semibold mb-4 dark:text-white">Main Window Layout</h2>
          
          <p className="mb-4 dark:text-gray-300">
            The RoverClient application features a clean, intuitive interface divided into several functional areas:
          </p>

          <div className="mb-8 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded p-4 mb-4">
              <div className="p-2 border-b border-gray-200 dark:border-gray-700 text-center font-medium text-sm dark:text-gray-300">
                Connection Bar
              </div>
              <div className="grid grid-cols-12 gap-2 mt-4">
                <div className="col-span-12 p-8 border border-gray-200 dark:border-gray-700 rounded text-center dark:text-gray-300">
                  Video Display Area
                </div>
                <div className="col-span-8 p-4 border border-gray-200 dark:border-gray-700 rounded dark:text-gray-300">
                  <div className="text-center mb-2 text-sm font-medium">Movement Controls</div>
                  <div className="grid grid-cols-3 gap-2 text-center text-xs">
                    <div></div>
                    <div className="p-2 bg-gray-200 dark:bg-gray-700 rounded">Forward</div>
                    <div></div>
                    <div className="p-2 bg-gray-200 dark:bg-gray-700 rounded">Left</div>
                    <div className="p-2 bg-gray-200 dark:bg-gray-700 rounded">Stop</div>
                    <div className="p-2 bg-gray-200 dark:bg-gray-700 rounded">Right</div>
                    <div></div>
                    <div className="p-2 bg-gray-200 dark:bg-gray-700 rounded">Backward</div>
                    <div></div>
                  </div>
                </div>
                <div className="col-span-4 p-4 border border-gray-200 dark:border-gray-700 rounded text-center dark:text-gray-300">
                  <div className="text-sm font-medium mb-2">Feature Controls</div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="p-2 bg-gray-200 dark:bg-gray-700 rounded">Lights On</div>
                    <div className="p-2 bg-gray-200 dark:bg-gray-700 rounded">Lights Off</div>
                    <div className="p-2 bg-gray-200 dark:bg-gray-700 rounded">Drift 1</div>
                    <div className="p-2 bg-gray-200 dark:bg-gray-700 rounded">Drift 2</div>
                  </div>
                </div>
                <div className="col-span-12 p-2 border border-gray-200 dark:border-gray-700 rounded dark:text-gray-300">
                  <div className="text-sm font-medium mb-2">Steering Control</div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded relative">
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-blue-500 rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              Diagram: RoverClient application layout showing the main functional areas
            </div>
          </div>

          <h2 className="text-2xl font-semibold mb-4 mt-8 dark:text-white">Connection Panel</h2>
          
          <p className="mb-4 dark:text-gray-300">
            The top section of the application contains the connection controls:
          </p>

          <ul className="list-disc pl-6 mb-6 space-y-2 dark:text-gray-300">
            <li><strong>IP Address Input:</strong> Text field to enter the ESP32&apos;s IP address (default: 192.168.1.100)</li>
            <li><strong>Connect Button:</strong> Toggles connection to the rover (changes to `&quot;Disconnect`&quot; when connected)</li>
            <li><strong>Status Indicator:</strong> Displays current connection status and any error messages</li>
          </ul>

          <p className="mb-4 dark:text-gray-300">
            This connection panel is the first interaction point for users. Enter the IP address of your Rover32 device 
            (which is displayed on its OLED screen when it boots up) and click Connect to establish communication.
          </p>

          <h2 className="text-2xl font-semibold mb-4 mt-8 dark:text-white">Video Display</h2>
          
          <p className="mb-4 dark:text-gray-300">
            The largest area of the application is dedicated to displaying the live video feed from the rover&apos;s camera:
          </p>

          <ul className="list-disc pl-6 mb-6 space-y-2 dark:text-gray-300">
            <li><strong>Video Canvas:</strong> Displays real-time JPEG frames from the rover&apos;s camera</li>
            <li><strong>Auto-Scaling:</strong> Automatically adjusts to maintain the proper aspect ratio</li>
            <li><strong>Default State:</strong> Shows black background when not connected</li>
          </ul>

          <p className="mb-4 dark:text-gray-300">
            The video display provides immediate visual feedback of the rover&apos;s perspective. The frame rate and 
            quality depend on the network connection quality and the distance between the rover and the access point.
          </p>

          <h2 className="text-2xl font-semibold mb-4 mt-8 dark:text-white">Movement Controls</h2>
          
          <p className="mb-4 dark:text-gray-300">
            The movement control section provides intuitive buttons for controlling the rover&apos;s motion:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h3 className="text-lg font-semibold mb-2 dark:text-white">Directional Buttons</h3>
              <ul className="list-disc pl-6 space-y-1 dark:text-gray-300 text-sm">
                <li><strong>Forward:</strong> Drives the rover forward</li>
                <li><strong>Backward:</strong> Drives the rover in reverse</li>
                <li><strong>Left:</strong> Steers the rover to the left</li>
                <li><strong>Right:</strong> Steers the rover to the right</li>
                <li><strong>Stop:</strong> Immediately halts all movement</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2 dark:text-white">Button Behavior</h3>
              <ul className="list-disc pl-6 space-y-1 dark:text-gray-300 text-sm">
                <li><strong>Press and Hold:</strong> Direction buttons activate while pressed</li>
                <li><strong>Release:</strong> Releasing movement buttons automatically stops the rover</li>
                <li><strong>Combined Controls:</strong> Can press forward while steering for turns</li>
                <li><strong>Emergency Stop:</strong> The Stop button immediately halts all motion</li>
              </ul>
            </div>
          </div>

          <p className="mb-4 dark:text-gray-300">
            These intuitive controls mimic the familiar directional pad layout found in many remote control 
            applications, making it easy for users to control the rover&apos;s movement.
          </p>

          <h2 className="text-2xl font-semibold mb-4 mt-8 dark:text-white">Steering Slider</h2>
          
          <p className="mb-4 dark:text-gray-300">
            The application features a precision steering slider for fine control of the rover&apos;s direction:
          </p>

          <ul className="list-disc pl-6 mb-6 space-y-2 dark:text-gray-300">
            <li><strong>Range:</strong> 30° to 130° (90° is center/straight)</li>
            <li><strong>Precision:</strong> Allows fine-grained steering adjustments</li>
            <li><strong>Real-time Updates:</strong> Changes take effect immediately as you move the slider</li>
            <li><strong>Center Reset:</strong> Direction buttons reset to center when released</li>
          </ul>

          <p className="mb-4 dark:text-gray-300">
            The steering slider provides more precise control than the Left/Right buttons alone. It&apos;s especially 
            useful for making slight course corrections or for maintaining a specific turning radius.
          </p>

          <h2 className="text-2xl font-semibold mb-4 mt-8 dark:text-white">Feature Control Buttons</h2>
          
          <p className="mb-4 dark:text-gray-300">
            Additional buttons provide access to special features:
          </p>

          <ul className="list-disc pl-6 mb-6 space-y-2 dark:text-gray-300">
            <li><strong>Lights On/Off:</strong> Controls the rover&apos;s headlights and taillights</li>
            <li><strong>Drift 1:</strong> Activates a pre-programmed drift maneuver pattern</li>
            <li><strong>Drift 2:</strong> Activates an alternative drift pattern with different dynamics</li>
          </ul>

          <p className="mb-4 dark:text-gray-300">
            These special function buttons allow access to fun and useful features without cluttering 
            the main movement controls.
          </p>

          <h2 className="text-2xl font-semibold mb-4 mt-8 dark:text-white">Keyboard Controls</h2>
          
          <p className="mb-4 dark:text-gray-300">
            The application supports keyboard controls for users who prefer keyboard input:
          </p>

          <div className="overflow-x-auto mb-6">
            <table className="min-w-full border-collapse dark:text-gray-300">
              <thead>
                <tr className="bg-gray-100 dark:bg-gray-800">
                  <th className="border p-2 text-left dark:border-gray-700">Key</th>
                  <th className="border p-2 text-left dark:border-gray-700">Function</th>
                  <th className="border p-2 text-left dark:border-gray-700">Behavior</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border p-2 dark:border-gray-700"><strong>W</strong></td>
                  <td className="border p-2 dark:border-gray-700">Forward</td>
                  <td className="border p-2 dark:border-gray-700">Hold to move forward, release to stop</td>
                </tr>
                <tr>
                  <td className="border p-2 dark:border-gray-700"><strong>S</strong></td>
                  <td className="border p-2 dark:border-gray-700">Backward</td>
                  <td className="border p-2 dark:border-gray-700">Hold to move backward, release to stop</td>
                </tr>
                <tr>
                  <td className="border p-2 dark:border-gray-700"><strong>A</strong></td>
                  <td className="border p-2 dark:border-gray-700">Steer Left</td>
                  <td className="border p-2 dark:border-gray-700">Hold to turn left, release to center steering</td>
                </tr>
                <tr>
                  <td className="border p-2 dark:border-gray-700"><strong>D</strong></td>
                  <td className="border p-2 dark:border-gray-700">Steer Right</td>
                  <td className="border p-2 dark:border-gray-700">Hold to turn right, release to center steering</td>
                </tr>
                <tr>
                  <td className="border p-2 dark:border-gray-700"><strong>Space</strong></td>
                  <td className="border p-2 dark:border-gray-700">Emergency Stop</td>
                  <td className="border p-2 dark:border-gray-700">Immediately stop all movement</td>
                </tr>
              </tbody>
            </table>
          </div>

          <p className="mb-4 dark:text-gray-300">
            The keyboard controls mirror the on-screen buttons but allow for faster response times and the ability 
            to control the rover without looking away from the video feed.
          </p>
          
          <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg border border-blue-100 dark:border-blue-900">
            <h3 className="text-lg font-semibold mb-2 text-blue-700 dark:text-blue-300">User Interface Tips</h3>
            <ul className="list-disc pl-6 space-y-2 text-blue-600 dark:text-blue-200">
              <li>The keyboard controls (WASD) often provide the most responsive control experience</li>
              <li>You can combine forward/backward movement with steering for smooth turns</li>
              <li>The Space bar serves as an emergency stop when you need to quickly halt the rover</li>
              <li>For the most precise steering control, use the slider rather than the buttons</li>
              <li>The application supports keyboard shortcuts even when the button areas don&apos;t have focus</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
