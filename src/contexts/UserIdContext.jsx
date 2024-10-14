import React, { createContext, useState, useEffect } from "react";

// Crear el contexto
export const UserIdContext = createContext();

// Proveedor del contexto
export const UserIdProvider = ({ children }) => {
  // Inicializa el estado desde sessionStorage
  const [userId, setUserId] = useState(() => {
    const savedUserId = sessionStorage.getItem("userId");
    return savedUserId ? savedUserId : "";
  });

  useEffect(() => {
    // Guarda el estado en localStorage cada vez que cambia
    sessionStorage.setItem("userId", userId);
  }, [userId]);

  return (
    <UserIdContext.Provider value={{ userId, setUserId }}>
      {children}
    </UserIdContext.Provider>
  );
};
