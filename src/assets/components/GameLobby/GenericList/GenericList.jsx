import React, { useState, useEffect } from "react";

export const GenericList = ({
  apiEndpoint,  //obligatorio
  from, //opcional
  to,   //opcional
  websocketUrl, //opcional
  renderItem, //obligatorio
}) => {
  const [items, setItems] = useState([]);

   // Efecto para cargar los ítems una vez al montar
   // o al cambiar desde donde hasta donde ver de la lista
   useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await fetch(apiEndpoint);
        const data = await response.json();
        setItems(data.slice(from, to));
      } catch (error) {
        console.error("Error fetching items:", error);
      }
    };

    fetchItems();
  }, [apiEndpoint, from, to]);

  // Efecto para manejar el WebSocket
  useEffect(() => {
    if (!websocketUrl) return;
    const socket = new WebSocket(websocketUrl);

    socket.onmessage = (event) => {
      console.log(event.data);
      const message = JSON.parse(event.data);

      if (message.type === "new_item") {
        const newItem = message.data;
        //Chekeo de que no se repitan IDs
        setItems((prevItems) => {
          const existe = prevItems.some((item) => item.id === newItem.id);
          if (!existe) {
            return [...prevItems, newItem];
          } else {
            console.log(`El item con ID ${newItem.id} ya existe.`);
            return prevItems; // retornar los elementos existentes si ya existe
          }
        });
      } else if (message.type === "remove_item") {
        const itemId = message.data.id;
        //se fija si algun objeto tiene la ID del mensaje para removerlo
        setItems((prevItems) => prevItems.filter((item) => item.id !== itemId));
      }
    };

    // Cleanup al desmontar el componente
    return () => {
      socket.close();
    };
  }, [apiEndpoint, websocketUrl]);

  return (
    <ul>
      {items.map((item) => (
        <li key={item.id}>{renderItem(item)}</li>
      ))}
    </ul>
  );
};