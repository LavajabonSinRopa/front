import React, { useState, useEffect, useRef } from "react";
import GenericListView from "./components/GenericListView";

export const GenericList = ({
  from, // OPCIONAL
  to, // OPCIONAL
  filterBy, // OPCIONAL
  filterKey, // OPCIONAL
  websocketUrl, // OPCIONAL
  renderItem, // OBLIGATORIO
  typeKey, // OBLIGATORIO
  idKey = "id", // OBLIGATORIO
  onCustomMessage, // OPCIONAL, Callback para mensajes personalizados
  reconnectInterval = 5000, // OPCIONAL, tiempo de espera para reconectar en ms
  numPlayers, // OPCIONAL
}) => {
  const [items, setItems] = useState([]); // Lista de items que se va a mostrar
  const [originalItems, setOriginalItems] = useState([]); // Lista de items que se recive
  const [error, setError] = useState(""); // Mensaje de error
  const [reconnecting, setReconnecting] = useState(false); // Se usa para mostrar un mensaje de reconexion
  const socketRef = useRef(null); // Referencia al WebSocket
  const reconnectTimeoutRef = useRef(null); // Referencia al intervalo de reconexion
  const isMounted = useRef(true); // Referencia para verificar si el componente está montado, se usa en el manejo de reconecciones

  // Función para abrir el WebSocket
  const connectWebSocket = () => {
    if (!websocketUrl) {
      setError("websocketUrl is required");
      return;
    }

    socketRef.current = new WebSocket(websocketUrl);

    socketRef.current.onopen = () => {
      console.log("WebSocket connected");
      setReconnecting(false);
      // Cancela los intentos de reconeccion que hayan quedado pendientes
      if (reconnectTimeoutRef.current)
        clearTimeout(reconnectTimeoutRef.current);
    };

    socketRef.current.onclose = () => {
      console.log("WebSocket closed, attempting to reconnect...");
      setReconnecting(true);
      // Intentar reconectar despues del intervalo definido solo si el componente sigue montado
      if (isMounted.current) {
        reconnectTimeoutRef.current = setTimeout(() => {
          connectWebSocket();
        }, reconnectInterval);
      }
    };

    socketRef.current.onerror = (event) => {
      console.error("WebSocket error observed:", event);
    };

    socketRef.current.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        //console.log("WebSocket message received:", message);
        if (message.type === typeKey) {
          const data = message.payload;
          setOriginalItems(data);
        }
        if (onCustomMessage) {
          onCustomMessage(message, setItems, items);
        }
      } catch (e) {
        console.error("Failed to process WebSocket message:", e);
        setError("Failed to process message from WebSocket");
      }
    };
  };

  // Inicialización y cierre del WebSocket
  useEffect(() => {
    isMounted.current = true; // Marcar el componente como montado
    connectWebSocket(); // Conectar al WebSocket inicialmente

    // Limpiar el WebSocket y el timeout de reconexión cuando el componente se desmonte
    return () => {
      isMounted.current = false; // Marcar el componente como desmontado
      if (socketRef.current) socketRef.current.close();
      if (reconnectTimeoutRef.current)
        clearTimeout(reconnectTimeoutRef.current);
    };
  }, [websocketUrl]);

  // Efecto para filtrar los items y mostrarlos
  useEffect(() => {
    try {
      let filteredItems = originalItems;
      if (filterBy && filterKey) {
        filteredItems = originalItems.filter((item) => {
          // Verificar que el campo filterBy existe en el item
          if (item[filterBy] && typeof item[filterBy] === "string") {
            return item[filterBy]
              .toLowerCase()
              .includes(filterKey.toLowerCase());
          }
          return false;
        });
      }
      if(numPlayers){
        filteredItems = filteredItems.filter((item) => {
          if (item["players"]) {
            return item["players"].length === numPlayers;
          }
          return false;
        });
      }
      filteredItems = filteredItems.slice(from, to);
      setItems(filteredItems);
    } catch (e) {
      console.error("Error filtering items:", e);
      setError("Error filtering items");
    }
  }, [filterKey, from, to, originalItems, filterBy,numPlayers]);

  return error ? (
    <div>Error: {error}</div>
  ) : reconnecting ? (
    <div>Intentando reconectar...</div>
  ) : (
    <GenericListView items={items} renderItem={renderItem} idKey={idKey} />
  );
};
