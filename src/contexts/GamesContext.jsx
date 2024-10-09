import React, { createContext, useState } from "react";

// Crear el contexto
export const GamesContext = createContext();

// Proveedor del contexto
export const GamesProvider = ({ children }) => {
  const [games, setGames] = useState([]);


  return (
    <GamesContext.Provider value={{ games, setGames }}>
      {children}
    </GamesContext.Provider>
  );
};
