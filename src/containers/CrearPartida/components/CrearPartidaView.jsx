import React from "react";

const CrearPartidaView = ({
  username,
  validUserName,
  name,
  validName,
  message,
  loading,
  password,
  onChangeUser,
  onChangeInput,
  onChangePassword,
  onSubmit,
}) => {
  return (
    <div>
      <h2>Usuario:</h2>
      <input
        placeholder="Elige un Nombre"
        value={username}
        onChange={onChangeUser}
      />
      <p>Caracteres usados: {username.length}/20</p>
      <h2>Nombre de la Partida:</h2>
      <input
        placeholder="Ingresa un Nombre"
        value={name}
        onChange={onChangeInput}
      />
      <p>Caracteres usados: {name.length}/20</p>
      <h2>Contraseña:</h2>
      <input
        placeholder="Ingresa una Contraseña"
        value={password}
        onChange={onChangePassword}
      />
      <p>Caracteres usados: {password.length}/10</p>
      <button
        style={{
          color: "white",
          backgroundColor: (validName && validUserName) ? "blue" : "red",
          cursor: (validName && validUserName) ? "pointer" : "not-allowed",
        }}
        disabled={!validName || !validUserName || loading}
        onClick={onSubmit}
      >
        {loading ? "CARGANDO..." : "CREAR PARTIDA"}
      </button>
      {!validName && name.length > 0 && (
        <p>El nombre de la partida no es válido.</p>
      )}
      {!validUserName && username.length > 0 && (
        <p>El nombre de usuario no es válido.</p>
      )}
      {message && <p>{message}</p>}
    </div>
  );
};

export default CrearPartidaView;
