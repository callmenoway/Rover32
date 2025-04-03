import React, { useEffect, useRef } from 'react';
import nipplejs from 'nipplejs'; //libreria per creare joistick poco stick e molto joy

//definiamo che il movimento è verso una direzione e non verso dove vuole lui
interface JoystickVirtualProps {
  onMove: (direction: string) => void;
}

//creaiamo sto joistick fallimentare
const JoystickVirtual: React.FC<JoystickVirtualProps> = ({ onMove }) => {
  const joystickRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    //rileva il movement di sto joistick virtuale
    if (joystickRef.current) {
      const manager = nipplejs.create({
        zone: joystickRef.current,
        mode: 'static', //è statico chill
        position: { left: '50%', top: '50%' }, //posizione nello schermo 360Hz
        color: 'cyan' //se vuoi cambiare il colore cambialo, altrimenti meglio cosi
      });

      manager.on('move', (evt, data) => {
        const { angle } = data;
        if (angle) {
          if (angle.degree >= 45 && angle.degree < 135) {
            onMove('forward'); //avanti
          } else if (angle.degree >= 135 && angle.degree < 225) {
            onMove('left'); //sinistra
          } else if (angle.degree >= 225 && angle.degree < 315) {
            onMove('backward'); //indietro
          } else {
            onMove('right'); //destra
          }
        }
      });

      manager.on('end', () => {
        onMove('stop'); //joistick fermo
      });
    }
  }, [onMove]);

  return (
    <div ref={joystickRef} className="joystick-container w-40 h-40 bg-gray-700 rounded-full mx-auto shadow-inner"></div>
  );
};

export default JoystickVirtual;
