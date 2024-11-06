import React from "react";

const ValidationMessage = ({ value, maxLength, isValid }) => {
  return (
    <div>
      <p>
        Caracteres usados: {value.length}/{maxLength}
      </p>
      {!isValid && value.length > 0 && (
        <p style={{ color: "red" }}>Solo se permiten letras y números!</p>
      )}
    </div>
  );
};

const CrearPartidaView = ({
  username,
  validUserName,
  name,
  validName,
  message,
  loading,
  password,
  validPassword,
  showPassword,
  onChangeUser,
  onChangeInput,
  onChangePassword,
  onSubmit,
  setShowPassword,
}) => {
  return (
    <div>
      <h2>Usuario:</h2>
      <input
        type="text"
        placeholder="Elige un Nombre"
        value={username}
        onChange={onChangeUser}
        maxLength={20}
        autoComplete="off"
        autoSave="off"
      />
      <ValidationMessage
        value={username}
        maxLength={20}
        isValid={validUserName}
      />

      <h2>Nombre de la Partida:</h2>
      <input
        type="text"
        placeholder="Ingresa un Nombre"
        value={name}
        onChange={onChangeInput}
        maxLength={20}
        autoComplete="off"
        autoSave="off"
      />
      <ValidationMessage value={name} maxLength={20} isValid={validName} />

      <h2>Contraseña:</h2>
      <div style={{ display: "flex", alignItems: "center" }}>
        <input
          type={showPassword ? "text" : "password"}
          placeholder="Ingresa una Contraseña"
          value={password}
          onChange={onChangePassword}
          maxLength={10}
          autoComplete="off"
          autoSave="off"
        />
        <button
          type="button"
          onClick={() => setShowPassword((prev) => !prev)}
          style={{ marginLeft: "10px", fontSize: "12px" }}
        >
          {showPassword ? "Ocultar" : "Mostrar"}
        </button>
      </div>
      <ValidationMessage
        value={password}
        maxLength={10}
        isValid={validPassword}
      />

      <button
        style={{
          color: "white",
          backgroundColor:
            validName &&
            validUserName &&
            (validPassword || password.length === 0)
              ? "blue"
              : "red",
          cursor:
            validName &&
            validUserName &&
            (validPassword || password.length === 0)
              ? "pointer"
              : "not-allowed",
        }}
        disabled={
          !validName ||
          !validUserName ||
          (!validPassword && password.length > 0) ||
          loading
        }
        onClick={onSubmit}
      >
        {loading ? "CARGANDO..." : "CREAR PARTIDA"}
      </button>
      {message && <p>{message}</p>}
    </div>
  );
};

export default CrearPartidaView;
