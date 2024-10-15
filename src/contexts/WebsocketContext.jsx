import React, { useEffect, useState, createContext, useContext, useCallback } from 'react';
import { BASE_WS_ADDRESS } from '../utils/constants';

export const WebSocketContext = createContext(null);

export const WebSocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [latestMessage, setLatestMessage] = useState(null);
  
  useEffect(() => {
    return () => {
      if (socket) {
        socket.close();
      }
    };
  }, [socket]);

  return (
    <WebSocketContext.Provider value={{ socket, setSocket, latestMessage, setLatestMessage }}>
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = (url) => {
  const { socket, setSocket, latestMessage, setLatestMessage } = useContext(WebSocketContext);

  useEffect(() => {
    if (!url) {
      return; 
    }

    const wsurl = `${BASE_WS_ADDRESS}${url.startsWith('/') ? url : '/' + url}`;
    const newSocket = new WebSocket(wsurl);

    setSocket(newSocket);

    newSocket.onopen = () => {
      console.log('WebSocket connection opened');
    };

    newSocket.onmessage = (event) => {
      console.log('WebSocket message received:', event.data);
      setLatestMessage(JSON.parse(event.data));
    };

    newSocket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    newSocket.onclose = (event) => {
      console.log('WebSocket connection closed:', event.reason);
    };
    
    return () => {
      newSocket.close();
    };
  }, [url, setSocket, setLatestMessage]);

  const sendMessage = useCallback((message) => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify(message));
    } else {
      console.warn('WebSocket is not open.');
    }
  }, [socket]);

  return { socket, latestMessage, sendMessage };
};
