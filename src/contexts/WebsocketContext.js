import React, { useEffect, useState, createContext, useContext } from 'react';
import { BASE_WS_ADDRESS } from '../utils/constants';

export const WebSocketContext = createContext(null);

export const WebSocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const ws = new WebSocket(`${BASE_WS_ADDRESS}`);
    setSocket(ws);

    return () => {
      ws.close();
    };
  }, []); 

  return (
    <WebSocketContext.Provider value={socket}>
      {children}
    </WebSocketContext.Provider>
  );
};

// Hook para usar el contexto
export const useWebSocket = () => {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error('useWebSocket must be used within a WebSocketProvider');
  }
  return context;
};
