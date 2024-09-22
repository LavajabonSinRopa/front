import React, { useEffect, useState, createContext, useContext } from 'react';
import { BASE_WS_ADDRESS } from '../utils/constants';

/*
  USO:
    import { useWebSocket } from "../../contexts/WebsocketContext";
    const { socket, sendMessage, connectionState } = useWebSocket();
    sendMessage(messageData);

    se puede usar
    socket.send(messageData) en vez de sendMessage(messageData)
    pero  sendMessage es mas seguro
*/


export const WebSocketContext = createContext(null);

export const WebSocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [status, setStatus] = useState('connecting');

  useEffect(() => {
    const ws = new WebSocket(`${BASE_WS_ADDRESS}`);
    ws.onopen = () => setStatus('connected');
    ws.onclose = () => setStatus('disconnected');

    setSocket(ws);

    return () => {
      ws.close();
    };
  }, []); 

  const sendMessage = (message) => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(message);
    }
  };

  return (
    <WebSocketContext.Provider value={{ socket, status, sendMessage }}>
      {children}
    </WebSocketContext.Provider>
  );
};

// hook personalizado
export const useWebSocket = () => {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error('Error: !context (WebsocketContext)');
  }
  return context;
};
