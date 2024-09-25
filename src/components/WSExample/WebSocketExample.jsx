import React, { useEffect } from 'react';
import { useWebSocket } from '../../contexts/WebsocketContext'; 

const WebSocketExample = () => {
  const socket = useWebSocket('/games'); 

  useEffect(() => {
    if (socket) {

      const handleOpen = () => {
        socket.send(JSON.stringify({ action: 'GET', endpoint: '/games' }));
      };

      const handleMessage = (event) => {
        console.log('Response from server:', event.data);
      };

      const handleError = (error) => {
        console.error('WebSocket error:', error);
      };

      const handleClose = () => {
        console.log('WebSocket connection closed');
      };

      socket.addEventListener('open', handleOpen);
      socket.addEventListener('message', handleMessage);
      socket.addEventListener('error', handleError);
      socket.addEventListener('close', handleClose);

      return () => {
        socket.removeEventListener('open', handleOpen);
        socket.removeEventListener('message', handleMessage);
        socket.removeEventListener('error', handleError);
        socket.removeEventListener('close', handleClose);
      };
    }
  }, [socket]);

  return (
    <div>
      <h1>WebSocket Example 2.0</h1>
    </div>
  );
};

export default WebSocketExample;
