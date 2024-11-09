import React, { createContext, useState } from "react";

// Crear el contexto
export const BlockFigCardContext = createContext();

// Proveedor del contexto
export const BlockFigCardProvider = ({ children }) => {
  const [blockFigCardId, setBlockFigCardId] = useState(null);
  const [blockFigCardType, setBlockFigCardType] = useState(null);
  const [opponentId, setOpponentId] = useState(null);

  return (
    <BlockFigCardContext.Provider
      value={{
        blockFigCardId,
        setBlockFigCardId,
        blockFigCardType,
        setBlockFigCardType,
        opponentId,
        setOpponentId,
      }}
    >
      {children}
    </BlockFigCardContext.Provider>
  );
};
