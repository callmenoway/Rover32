import React, { useEffect } from 'react';

interface GamepadControllerProps {
  onMove: (direction: string) => void;
}

const GamepadController: React.FC<GamepadControllerProps> = ({ onMove }) => {
  useEffect(() => {
    const handleGamepadConnected = (event: GamepadEvent) => {
      console.log('Gamepad connected:', event.gamepad);
      requestAnimationFrame(updateGamepadStatus);
    };

    const handleGamepadDisconnected = (event: GamepadEvent) => {
      console.log('Gamepad disconnected:', event.gamepad);
    };

    const updateGamepadStatus = () => {
      const gamepad = navigator.getGamepads()[0];
      if (gamepad) {
        const [leftX, leftY] = gamepad.axes;

        console.log(`Left stick X: ${leftX}, Y: ${leftY}`); //log da togliere quando ho voglia

        const threshold = 0.2;

        if (leftY < -threshold) {
          onMove('forward');
          console.log('Moving forward');
        } else if (leftY > threshold) {
          onMove('backward');
          console.log('Moving backward');
        } else if (leftX < -threshold) {
          onMove('left');
          console.log('Turning left');
        } else if (leftX > threshold) {
          onMove('right');
          console.log('Turning right');
        } else {
          onMove('stop');
          console.log('Stopping');
        }
      }

      requestAnimationFrame(updateGamepadStatus);
    };

    window.addEventListener('gamepadconnected', handleGamepadConnected);
    window.addEventListener('gamepaddisconnected', handleGamepadDisconnected);

    return () => {
      window.removeEventListener('gamepadconnected', handleGamepadConnected);
      window.removeEventListener('gamepaddisconnected', handleGamepadDisconnected);
    };
  }, [onMove]);

  return <div></div>;
};

export default GamepadController;
