import React, { createContext, useState, useEffect } from "react";

// Crear el contexto
export const UserIdContext = createContext();

// Proveedor del contexto
export const UserIdProvider = ({ children }) => {
  // Inicializa el estado desde localStorage
  const [userId, setUserId] = useState(() => {
    const savedUserId = localStorage.getItem("userId");
    return savedUserId ? savedUserId : "";
  });

  useEffect(() => {
    // Guarda el estado en localStorage cada vez que cambia
    localStorage.setItem("userId", userId);
  }, [userId]);

  return (
    <UserIdContext.Provider value={{ userId, setUserId }}>
      {children}
    </UserIdContext.Provider>
  );
};
