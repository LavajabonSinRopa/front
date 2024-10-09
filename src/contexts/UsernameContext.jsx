import React, { createContext, useState } from "react";

// Crear el contexto
export const UsernameContext = createContext();

// Proveedor del contexto
export const UsernameProvider = ({ children }) => {
  const [username, setUsername] = useState("");
  const [validUsername, setValidUsername] = useState(false);

  const handleChangeUser = (e) => {
    const newUsername = e.target.value;
    const isValid = /^[a-zA-Z0-9\s]*$/.test(newUsername);
    setUsername(newUsername);

    if (newUsername.length > 20 || newUsername.trim() === "" || !isValid) {
      setValidUsername(false);
    } else {
      setValidUsername(true);
    }
  };

  return (
    <UsernameContext.Provider value={{ username, validUsername, handleChangeUser }}>
      {children}
    </UsernameContext.Provider>
  );
};
