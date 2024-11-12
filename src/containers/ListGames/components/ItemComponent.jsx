import React, { useContext, useState } from "react";
import { UsernameContext } from "../../../contexts/UsernameContext";
import hide from "../../../assets/hide.svg";
import view from "../../../assets/view.svg";
import { isValidDateOrTimeValue } from "@testing-library/user-event/dist/cjs/utils/index.js";
import "./ItemComponent.css";

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

const ItemComponent = ({ item, handleClick }) => {
  const { username, validUsername, handleChangeUser } =
    useContext(UsernameContext);
  const ownerName = item.player_names.find(
    (name, index) => index === item.players.indexOf(item.creator)
  );
  const [password, setPassword] = useState("");
  const [validPassword, setValidPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [passwordError, setPasswordError] = useState(false);

  const handleChangePassword = (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    const isValidPassword =
      /^[a-zA-Z0-9]{0,10}$/.test(newPassword) && newPassword.length <= 10;
    setValidPassword(isValidPassword && newPassword.length > 0);
    if (newPassword.length === 0) {
      setPasswordError(false);
    }
  };

  const isPrivate = item.type == "private";
  const players = item.players.length;

  const handleJoinClick = async () => {
    if (isPrivate && !validPassword) {
      setPasswordError(true);
      return;
    }
    try {
      await handleClick(password);
    } catch (error) {
      setPasswordError(true);
    }
  };

  return (
    <div key={item.unique_id} className="item-container">
      <h1>{item.name}</h1>
      <div className="item-grid">
        <div>
          <h2>{"Cantidad de Jugadores: " + item.players.length + "/4"}</h2>
          <p>{"Estado: " + item.state}</p>
          <p>{"Dueño: " + ownerName}</p>
        </div>
        <div className="item-flex-column">
          {isPrivate && item.players.length !== 4 && (
            <div className="item-flex-column">
              {/* Input escondido para que el browser no sugiera contraseñas >:( */}
              <input type="password" style={{ display: "none" }} />
              <div className="item-flex-row">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Ingresa una Contraseña"
                  value={password}
                  onChange={handleChangePassword}
                  maxLength={10}
                  autoComplete="off"
                  inputMode="text"
                  className="input-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="button-show-password"
                  disabled={password.length === 0}
                >
                  <img
                    src={showPassword ? hide : view}
                    alt={showPassword ? "Ocultar" : "Mostrar"}
                    className="img-show-password"
                  />
                </button>
              </div>
              <ValidationMessage
                value={password}
                maxLength={10}
                isValid={validPassword}
              />
              {passwordError && (
                <p data-testid="password-error" style={{ color: "red" }}>
                  Contraseña incorrecta
                </p>
              )}
            </div>
          )}
          <div>
            {players !== 4 && (
              <button
                onClick={handleJoinClick}
                className={`button-join ${
                  !validUsername ||
                  item.state === "started" ||
                  players === 4 ||
                  (isPrivate && (!validPassword || password.length === 0))
                    ? "button-join-disabled"
                    : ""
                }`}
                disabled={
                  !validUsername ||
                  item.state === "started" ||
                  players === 4 ||
                  (isPrivate && (!validPassword || password.length === 0))
                }
              >
                UNIRSE
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemComponent;