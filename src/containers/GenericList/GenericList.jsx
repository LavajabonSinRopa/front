import React, { useState, useEffect } from "react";
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
}) => {
  const [items, setItems] = useState([]);

  // Efecto para manejar el WebSocket
  useEffect(() => {
    if (!websocketUrl) return;
    const socket = new WebSocket(websocketUrl);

    socket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      console.log(message)
      if (message.type === typeKey) {
        const data = message.payload;
        let updatedItems;

        if (filterBy && filterKey) {
          updatedItems = data
            .filter((item) => item[filterBy].toLowerCase().includes(filterKey.toLowerCase()))
            .slice(from, to);
        } else {
          updatedItems = data.slice(from, to);
        }
        setItems(updatedItems);
      } else if (onCustomMessage) {
        onCustomMessage(message, setItems, items);
      }
    };
    
    // Cleanup al desmontar el componente
    return () => {
      socket.close();
    };
  }, [websocketUrl, filterKey, from, to, onCustomMessage]);

  return (
    <GenericListView items={items} renderItem={renderItem} idKey={idKey}/>
  );
};
