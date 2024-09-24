//hecho por chatgpt

import React, { useState, useEffect } from 'react';
import { useWebSocket } from '../../contexts/WebsocketContext';

const WebSocketExample = () => {
  const { socket } = useWebSocket();
  const [messages, setMessages] = useState([]); 
  const [input, setInput] = useState(''); 
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
      socket.send(input);
      setInput(''); 
    }
  };

  return (
    <div>
      <h1>WebSocket Example</h1>

      <div>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Escribe un mensaje"
        />
        <button onClick={handleSendMessage} >
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
