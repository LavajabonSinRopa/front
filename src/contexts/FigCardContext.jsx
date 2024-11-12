import React, { createContext, useState } from "react";

// Crear el contexto
export const FigCardContext = createContext();

// Proveedor del contexto
export const FigCardProvider = ({ children }) => {
  const [figCardId, setFigCardId] = useState(null);
  const [figCardType, setFigCardType] = useState(null);

  return (
    <FigCardContext.Provider value={{ figCardId, setFigCardId, figCardType, setFigCardType }}>
      {children}
    </FigCardContext.Provider>
  );
};
