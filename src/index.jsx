import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { WebSocketProvider } from './contexts/WebsocketContext'; // Ajusta el nombre según corresponda
import App from './App'; // Importa el componente raíz

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <WebSocketProvider>
      <App /> {/* Renderiza el componente raíz */}
    </WebSocketProvider>
  </StrictMode>
)
