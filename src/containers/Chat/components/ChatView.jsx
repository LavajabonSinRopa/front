import React, { useState, useEffect, useRef, useContext } from "react";
import { UserIdContext } from "../../../contexts/UserIdContext.jsx";
import "./ChatView.css";

function ChatView({
  messages,
  setMessages,
  unSendMessage,
  setUnSendMessage,
  handleSend,
  msgError,
  setMsgError,
}) {
  const [newMsgFlag, setNewMsgFlag] = useState(false);
  const { userId } = useContext(UserIdContext);

  // Referencia al contenedor del chat
  const chatContainerRef = useRef(null);

  // Efecto que mueve el scroll al final solo si ya esta al final
  // y gestiona notificaciones de nuevos mensajes
  useEffect(() => {
    if (chatContainerRef.current && messages.length > 0) {
      const container = chatContainerRef.current;
      
      // Verifica si el scroll está al final
      const isAtBottom =
        container.scrollHeight - container.scrollTop <= container.clientHeight + 500;
  
      // Asegúrate de que messages[messages.length-1] y su propiedad 'message' existan
      const lastMessage = messages[messages.length - 1];
      const isUserMessage = lastMessage?.id === userId;
  
      if (isAtBottom || isUserMessage) {
        // Si está al final, mover el scroll al fondo
        container.scrollTop = container.scrollHeight;
        setNewMsgFlag(false);
      } else {
        // Si no está al final, no mover el scroll
        setNewMsgFlag(true);
      }
    }
  }, [messages, userId]); // Considera también añadir userId si cambia y es relevante
  

  // Efecto para manejar la accion de scroll manual del usuario
  const handleScroll = () => {
    if (chatContainerRef.current) {
      const container = chatContainerRef.current;

      const isAtBottom =
        container.scrollHeight - container.scrollTop <=
        container.clientHeight + 50;
      if (isAtBottom) {
        setNewMsgFlag(false);
      }
    }
  };

  // Enviar el mensaje al presionar "Enter"
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSend(); 
    }
  };

  return (
    <div className="chat-container">
      <h1>Chat</h1>
      <div
        className="chat"
        ref={chatContainerRef}
        onScroll={handleScroll}
        data-testid="scrollable-chat"
      >
        {messages.length > 0 ? (
          <ul className="chatMessages">
            {messages.map((message, index) => (
              <li
                className={
                  message.type === "message"
                    ? message.id === userId
                      ? "userMsg"
                      : "opponentMsg"
                    : "logMsg"
                }
                key={index}
              >
                {message.type === "message" ? (
                  <>
                    <b>{message.msgInfo}</b>
                    {message.text}
                  </>
                ) : (
                  <b>{message.text}</b>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p className="noMsg">No hay mensajes</p>
        )}
      </div>
      {newMsgFlag && <div className="newMsgFlag">Nuevo(s) mensaje(s).</div>}
      {msgError && <p className="msgError">{msgError}</p>}
      <div className="inputMessage">
        <input
          type="text"
          value={unSendMessage}
          placeholder="Escribe un mensaje..."
          onChange={(e) => {
            setUnSendMessage(e.target.value);
            setMsgError("");
          }}
          onKeyDown={handleKeyDown}
        />
        <button className="sendMsgButton" onClick={handleSend}>
          Enviar
        </button>
      </div>
    </div>
  );
}

export default ChatView;
