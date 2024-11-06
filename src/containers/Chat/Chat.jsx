import React, { useState } from "react";
import ChatView from "./components/ChatView";
import { input } from "@testing-library/user-event/dist/cjs/event/input.js";

function Chat({ messages, setMessages, socketRef }) {
  const [unSendMessage, setUnSendMessage] = useState("");
  const [msgError, setMsgError] = useState("");

  const handleSend = () => {
    if (unSendMessage.trim() && unSendMessage.length < 1000) {
      if (
        socketRef.current &&
        socketRef.current.readyState === WebSocket.OPEN
      ) {
        socketRef.current.send(unSendMessage);
        setUnSendMessage("");
        setMsgError("");
      } else {
        setMsgError("Error al enviar el mensaje");
      }
    } else {
      setMsgError("El mensaje no puede estar vacio o tener mas de 1000 caracteres");
    }
  };

  return (
    <ChatView
      messages={messages}
      setMessages={setMessages}
      unSendMessage={unSendMessage}
      setUnSendMessage={setUnSendMessage}
      handleSend={handleSend}
      msgError={msgError}
      setMsgError={setMsgError}
    />
  );
}

export default Chat;
