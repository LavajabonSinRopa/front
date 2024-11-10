import React, { useState, useEffect} from "react";
import "./CrearPartidaView.css";
import createGameTitle from "./switcher_UI_UX_desing_create_game_banner.svg";
import inputErrorNotification from "./errorInputNotificationAssett.svg";
import hide from "../../../assets/hide.svg";
import view from "../../../assets/view.svg";

const ValidationMessage = ({ value, maxLength, isValid }) => {
  return (
    <p
      style={{
        color: !isValid && value.length > 0 ? "red" : "#052d38",
        fontWeight: "bold",
      }}
    >
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
  const [userInputError, setUserInputError] = useState(false);
  const [nameInputError, setNameInputError] = useState(false);
  const [passwordInputError, setPasswordInputError] = useState(false);

  // Usamos un useEffect para manejar la validación
  useEffect(() => {
    setUserInputError(!validUserName && username.length > 0);
  }, [validUserName, username]);

  useEffect(() => {
    setNameInputError(!validName && name.length > 0);
  }, [validName, name]);

  useEffect(() => {
    setPasswordInputError(!validPassword && password.length > 0);
  }, [validPassword, password]);

  return (
    <>
      <div className="createGameContainer">
        <div className="createGameMenuConteiner">
          <img className="createGameTitle" src={createGameTitle} />
          <img
            className="inputErrorNotification"
            src={inputErrorNotification}
            style={{
              opacity:
                userInputError || nameInputError || passwordInputError ? 1 : 0, // Ajustar opacidad
              transform:
                userInputError || nameInputError || passwordInputError
                  ? "translateX(-45%)"
                  : "translateX(0%)", // Mover hacia la izquierda
              transition: "transform 0.5s ease-in, opacity 0.3s ease-in", // Transición para mover y desvanecer
            }}
          />
          <div className="createGameMenu">
            <div className="usernameCreateGame">
              <input
                type="text"
                style={{ border: "none" }}
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
                setInputError={setUserInputError}
              />
            </div>

            <div className="gameNameCreateGame">
              <input
                style={{ border: "none" }}
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
                setInputError={setNameInputError}
              />
            </div>

            <div className="passwordCreateGame">
              <div style={{ display: "flex", alignItems: "center" }}>
                <input
                  style={{ border: "none", width: "100%" }}
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
                  <img
                    src={showPassword ? hide : view}
                    alt={showPassword ? "Ocultar" : "Mostrar"}
                    style={{ width: "20px", height: "20px" }}
                  />
                </button>
              </div>
              <ValidationMessage
                value={password}
                maxLength={10}
                isValid={validPassword}
                setInputError={setPasswordInputError}
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
                  ? "#06313a"
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
