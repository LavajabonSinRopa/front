import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { WebSocketProvider } from './contexts/WebsocketContext';
import App from './App';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <WebSocketProvider>
      <App /> 
    </WebSocketProvider>
  </StrictMode>
)
