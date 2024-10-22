import React, { createContext, useState } from "react";

// Crear el contexto
export const MovementContext = createContext();

// Proveedor del contexto
export const MovementProvider = ({ children }) => {
  const [firstPieceXaxis, setFirstPieceXaxis] = useState(null);
  const [firstPieceYaxis, setFirstPieceYaxis] = useState(null);
  const [secondPieceXaxis, setSecondPieceXaxis] = useState(null);
  const [secondPieceYaxis, setSecondPieceYaxis] = useState(null);

  return (
    <MovementContext.Provider
      value={{
        firstPieceXaxis,
        setFirstPieceXaxis,
        firstPieceYaxis,
        setFirstPieceYaxis,
        secondPieceXaxis,
        setSecondPieceXaxis,
        secondPieceYaxis,
        setSecondPieceYaxis,
      }}
    >
      {children}
    </MovementContext.Provider>
  );
};
