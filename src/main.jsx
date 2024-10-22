import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { WebSocketProvider } from "./contexts/WebsocketContext.jsx";

createRoot(document.getElementById("root")).render(
  <WebSocketProvider>
    <StrictMode>
      <App />
    </StrictMode>
  </WebSocketProvider>
);
