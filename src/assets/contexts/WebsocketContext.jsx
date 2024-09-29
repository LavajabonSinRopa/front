import React, { useEffect, useState, createContext, useContext } from 'react';
import { BASE_WS_ADDRESS } from '../utils/constants';

export const WebSocketContext = createContext(null);

/*
  USO: 
  import { useWebSocket } from '../contexts/WebsocketContext'; 
  const socket = useWebSocket('[endpoint]'); p. ej useWebSocket('/games')
  addEventListener() y removeEventListener()

*/
export const WebSocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  useEffect(() => {
    return () => {
      if (socket) {
        socket.close();
      }
    };
  }, [socket]);

  return (
    <WebSocketContext.Provider value={{ socket, setSocket }}>
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = (url) => {
  const { socket, setSocket } = useContext(WebSocketContext);

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
      console.log('WebSocket message received: bla bla bla muchos datos');
      //console.log('WebSocket message received:', event.data);
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
  }, [url, setSocket]);

  return socket;
};