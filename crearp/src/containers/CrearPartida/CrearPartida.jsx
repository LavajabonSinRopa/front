import React, { useState } from "react";

const CrearPartida = ({ playerName }) => {
  const [name, setName] = useState("");
  const [validName, setValidName] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState("");

  const handleChangeInput = (e) => {
    setMessage("");
    const newName = e.target.value;
    // Verifica que solo se usen letras y numeros
    const isValid = /^[a-zA-Z0-9\s]*$/.test(newName);
    setName(newName);

    if (newName.length > 20 || newName.trim() === "" || !isValid) {
      setValidName(false);
    } else {
      setValidName(true);
    }
  };

  const handleChangePassword = (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword)
  }

  const handleSubmit = async () => {
    if (!validName) return;

    const data = {
      game_name: name,
      player_name: playerName,
    };

    setLoading(true); // Indica que se esta cargando

    try {
      const response = await fetch("/api/games", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        setMessage("Hubo un problema al crear la partida, intenta de nuevo.");
        return;
      }
      
      const result = await response.json();
      setMessage("Creación de partida exitosa.");
      console.log("Partida creada:", result);
    } catch (error) {
      console.error("Error al crear la partida:", error);
      setMessage("Hubo un problema al crear la partida, intenta de nuevo.");
    } finally {
      setLoading(false); // Se ha terminado de cargar
    }
  };

  return (
    <div>
      <h2>Nombre de la Partida:</h2>
      <input
        placeholder="Ingresa un Nombre"
        value={name}
        onChange={handleChangeInput}
      />
      <p>Caracteres usados: {name.length}/20</p>
      <h2>Contraseña:</h2>
      <input
        placeholder="Ingresa una Contraseña"
        value={password}
        onChange={handleChangePassword}
      />
      <p>Caracteres usados: {password.length}/10</p>
      <button
        style={{
          backgroundColor: validName ? "blue" : "red",
          cursor: validName ? "pointer" : "not-allowed",
        }}
        disabled={!validName || loading}
        onClick={handleSubmit}
      >
        {loading ? "CARGANDO..." : "CREAR PARTIDA"}
      </button>
      {!validName && name.length > 0 && (
        <p>El nombre de la partida no es válido.</p>
      )}
      {message && <p>{message}</p>}
    </div>
  );
};

export default CrearPartida;