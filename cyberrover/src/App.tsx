import React, { useState } from 'react';
import './App.css';
import JoystickVirtual from './components/JoystickVirtual';
import GamepadController from './components/GamepadController';
import VideoStream from './components/VideoStream'
import useWebSocket from './hooks/useWebSocket';

const App: React.FC = () => {
  const [streamUrl, setStreamUrl] = useState<string>('http://<INDIRIZZO_IP_ESP32>/stream');
  const [showNotification, setShowNotification] = useState<boolean>(true);
  const sendMessage = useWebSocket('ws://192.168.1.100:81', (data) => { //SETTARE IP DELLA CAM ESP32
    console.log('Received:', data);
  });

  const handleMove = (direction: string) => {
    console.log(`Joystick moving: ${direction}`);
    sendMessage(direction);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-800 to-black text-white flex flex-col items-center">
      <h1 className="text-4xl font-bold mt-8 mb-4">Cyber Rover</h1> {/* titolo arbitrario*/}
      {showNotification && (
        <div className="bg-blue-600 text-white p-4 rounded-md shadow-lg mb-4 flex items-center">
          <p className="flex-grow">Collega il tuo controller PS4 per un'esperienza ottimale!</p> {/* notifica */}
          <button
            onClick={() => setShowNotification(false)}
            className="text-white hover:bg-blue-800 p-2 rounded-md ml-2"
          >
            &times;
          </button>
        </div>
      )}
      <VideoStream streamUrl={streamUrl} />
      <div className="controls mt-6">
        <GamepadController onMove={handleMove} />
        <JoystickVirtual onMove={handleMove} />
      </div>
      <footer className="mt-auto mb-4 text-sm text-gray-400">
        &copy; 2024 Cyber Rover - All Rights Reserved {/* copyright per far vedere che siamo professionali */}
      </footer>
    </div>
  );
};

export default App;
