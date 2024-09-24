import React, { useEffect, useState, createContext, useContext } from 'react';
import { BASE_WS_ADDRESS } from '../utils/constants';

/*
  USO:
    import { useWebSocket } from "../../contexts/WebsocketContext";
    const { socket } = useWebSocket();
    socket.send(data);
*/


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
    <WebSocketContext.Provider value={{ socket }}>
      {children}
    </WebSocketContext.Provider>
  );
};

// hook personalizado
export const useWebSocket = () => {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error('WebsocketContext');
  }
  return context;
};
