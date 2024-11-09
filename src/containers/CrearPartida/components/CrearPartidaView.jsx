import React from "react";
import "./CrearPartidaView.css";
import createGameTitle from "./switcher_UI_UX_desing_banner.svg";

const ValidationMessage = ({ value, maxLength, isValid }) => {
  return !isValid && value.length > 0 ? (
    <p style={{ color: "red" }}>Solo se permiten letras y números!</p>
  ) : (
    <p style={{ color: "#052d38", fontWeight: "bold" }}>
      Caracteres usados: {value.length}/{maxLength}
    </p>
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
    <>
      <div className="createGameContainer">
        <div className="createGameMenuConteiner">
          <img className="createGameTitle" src={createGameTitle} />
          <div className="createGameMenu">
            <div className="usernameCreateGame">
              <input
                type="text"
                placeholder="Nombre de Usuario"
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
            </div>

            <div className="gameNameCreateGame">
              <input
                type="text"
                placeholder="Nombre de la Partida"
                value={name}
                onChange={onChangeInput}
                maxLength={20}
                autoComplete="off"
                autoSave="off"
              />
              <ValidationMessage
                value={name}
                maxLength={20}
                isValid={validName}
              />
            </div>

            <div className="passwordCreateGame">
              <div style={{ display: "flex", alignItems: "center" }}>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Contraseña (opcional)"
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
            </div>
          </div>
          <button
            className="createGameButton"
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
      </div>
    </>
  );
};

export default CrearPartidaView;
