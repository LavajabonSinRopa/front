import React, { useState, useEffect } from "react";

export const GenericList = (
  {
  from, //OPCIONAL, desde que elemento se muestra
  to, //OPCIONAL, hasta que elemento se muestra
  filterBy, //OPCIONAL, en base a que atributo se va a filtrar
  filterKey, //OPCIONAL, dato por el cual se filtra
  websocketUrl, //OPCIONAL
  renderItem, //OBLIGATORIO, como renderizan los elementos
  typeKey,  //OBLIGATORIO, nombre del atributo del tipo del mensaje
  idKey = "id", // OBLIGATORIO, nombre del atributo de id
}) => {
  const [items, setItems] = useState([]);

  // Efecto para manejar el WebSocket
  useEffect(() => {
    if (!websocketUrl) return;
    const socket = new WebSocket(websocketUrl);

    socket.onmessage = (event) => {
      console.log(event.data);
      const message = JSON.parse(event.data);
      if (message.type === typeKey) {
        const data = message.payload;
        let updatedItems = null;
        if (filterBy && filterKey) {
          updatedItems = data
            .filter((item) => item[filterBy].includes(filterKey))
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
    <ul style={{ listStyleType: "none", padding: 0, margin: 0 }}>
      {items.map((item) => (
        <li key={item[idKey]}>{renderItem(item)}</li>
      ))}
    </ul>
  );
};