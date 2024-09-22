//hecho por chatgpt

import React, { useState, useEffect } from 'react';
import { useWebSocket } from './WebsocketContext';

const WebSocketExample = () => {
  const { socket, sendMessage, status } = useWebSocket(); // Accede al socket, enviar mensajes y el estado
  const [messages, setMessages] = useState([]); // Para almacenar los mensajes recibidos
  const [input, setInput] = useState(''); // Para almacenar el mensaje del input

  useEffect(() => {
    if (socket) {
      socket.onmessage = (event) => {
        const newMessage = event.data;
        setMessages((prevMessages) => [...prevMessages, newMessage]);
      };
    }

    return () => {
      if (socket) {
        socket.onmessage = null;
      }
    };
  }, [socket]);

  const handleSendMessage = () => {
    if (input.trim()) {
      sendMessage(input);
      setInput(''); 
    }
  };

  return (
    <div>
      <h1>WebSocket Example</h1>
      <p>Estado de la conexión: {status}</p>

      <div>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Escribe un mensaje"
        />
        <button onClick={handleSendMessage} disabled={status !== 'connected'}>
          Enviar
        </button>
      </div>

      <div>
        <h2>Mensajes recibidos:</h2>
        <ul>
          {messages.map((msg, index) => (
            <li key={index}>{msg}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default WebSocketExample;
