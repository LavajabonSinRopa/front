import React, { useState, useEffect, useRef } from "react";
import "./ChatView.css";

function ChatView({ playerName, messages, setMessages }) {
  const [unSendMessage, setUnSendMessage] = useState("");
  const [newMsgFlag, setNewMsgFlag] = useState(false);

  // Crear una referencia al contenedor del chat
  const chatContainerRef = useRef(null);

  // Efecto que mueve el scroll al final solo si ya está al final
  useEffect(() => {
    if (chatContainerRef.current) {
      const container = chatContainerRef.current;
      // Verificamos si el scroll está al final
      const isAtBottom =
        container.scrollHeight - container.scrollTop <=
        container.clientHeight + 500;
      if (isAtBottom) {
        // Si está al final, mover el scroll al fondo
        container.scrollTop = container.scrollHeight;
        setNewMsgFlag(false);
      } else {
        // Si no está al final, no mover el scroll
        setNewMsgFlag(true);
      }
    }
  }, [messages]); // Se ejecuta cada vez que los mensajes cambian

  const handleSend = () => {
    if (unSendMessage.trim() && unSendMessage.length < 1000) {
      // Evita enviar un mensaje vacío
      // Añade el mensaje a la lista de mensajes
      setMessages((prevMessages) => [
        ...prevMessages,
        playerName + ": " + unSendMessage,
      ]);
      // Limpia el input después de enviar
      setUnSendMessage("");
    }
  };

  // Efecto para manejar la acción de scroll manual del usuario
  const handleScroll = () => {
    if (chatContainerRef.current) {
      const container = chatContainerRef.current;

      // Si el usuario llegó al final del contenedor, ponemos el newMsgFlag en false
      const isAtBottom =
        container.scrollHeight - container.scrollTop <=
        container.clientHeight + 50;
      if (isAtBottom) {
        setNewMsgFlag(false);
      }
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSend(); // Enviar el mensaje al presionar "Enter"
    }
  };

  return (
    <div className="chat-container">
      <h1>Chat</h1>
      <div
        className="chat"
        style={{
          height: "500px",
          maxWidth: "500px",
          overflowX: "none",
          overflowY: "auto",
        }}
        ref={chatContainerRef}
        onScroll={handleScroll} // Detectar scroll manual del usuario
      >
        {messages.length > 0 ? (
          <ul className="chatMessages">
            {messages.map((message, index) => (
              <li className="message" key={index}>
                {message}
              </li>
            ))}
          </ul>
        ) : (
          <p className="noMsg">No hay mensajes</p>
        )}
      </div>
      {newMsgFlag && <div className="newMsgFlag">Nuevo(s) mensaje(s).</div>}
      <div className="inputMessage">
        <input
          type="text"
          value={unSendMessage} // Vincula el input con el estado
          placeholder="Escribe un mensaje..."
          onChange={(e) => setUnSendMessage(e.target.value)} // Actualiza el estado al escribir
          onKeyDown={handleKeyDown} // Añadir el evento para "Enter"
        />
        <button className="sendMsgButton" onClick={handleSend}>
          Send
        </button>
      </div>
    </div>
  );
}

export default ChatView;
