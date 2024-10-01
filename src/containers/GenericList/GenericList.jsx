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
  sendDataToParent,
}) => {
  const [items, setItems] = useState([]);

  // Efecto para manejar el WebSocket
  useEffect(() => {
    if (!websocketUrl) return;
    const socket = new WebSocket(websocketUrl);

    socket.onmessage = (event) => {
      const message = JSON.parse(event.data);
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
      }
    };
    
    // Cleanup al desmontar el componente
    return () => {
      socket.close();
    };
  }, [websocketUrl, filterKey, from, to]);

  return (
    <GenericListView items={items} renderItem={renderItem} idKey={idKey} sendDataToParent={sendDataToParent}/>
  );
};
