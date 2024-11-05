import React, { useState } from "react";
import ChatView from "./components/ChatView";

function Chat ({playerName}) {
  const [messages, setMessages] = useState([]);
  const handleSend = () => {
    setMessages([...messages, message]);
  };
  return <ChatView playerName={playerName} messages={messages} setMessages={setMessages}/>;
};

export default Chat;
