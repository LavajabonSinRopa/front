import React, { createContext, useState } from "react";

// Crear el contexto
export const MovCardContext = createContext();

// Proveedor del contexto
export const MovCardProvider = ({ children }) => {
  const [movCardId, setMovCardId] = useState(null);
  const [movCardType, setMovCardType] = useState(null);

  return (
    <MovCardContext.Provider value={{ movCardId, setMovCardId, movCardType, setMovCardType }}>
      {children}
    </MovCardContext.Provider>
  );
};
