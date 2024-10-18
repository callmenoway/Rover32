import { useEffect, useRef } from 'react';

const useWebSocket = (url: string, onMessage: (data: any) => void) => {
  const socket = useRef<WebSocket | null>(null);

  useEffect(() => {
    socket.current = new WebSocket(url);
    socket.current.onopen = () => {
      console.log('WebSocket connected'); //calzino della befana connesso
    };

    socket.current.onmessage = (event) => {
      console.log('Message from server:', event.data); //calzino della befana riceve qualcosa
      onMessage(event.data);
    };

    socket.current.onclose = () => {
      console.log('WebSocket disconnected'); //calzino della befana disconnesso
    };

    return () => {
      socket.current?.close(); //chiusura calzino della befana
    };
  }, [url, onMessage]);

  const sendMessage = (message: string) => {
    if (socket.current && socket.current.readyState === WebSocket.OPEN) {
      socket.current.send(message);
      console.log(`Sent message: ${message}`); //calzino della befana invia qualcosa
    }
  };

  return sendMessage;
};

export default useWebSocket;
