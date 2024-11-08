import React, { useContext, useState } from "react";
import { UsernameContext } from "../../../contexts/UsernameContext";
import hide from "../../../assets/hide.svg";
import view from "../../../assets/view.svg";
import { isValidDateOrTimeValue } from "@testing-library/user-event/dist/cjs/utils/index.js";

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
    <div
      key={item.unique_id}
      style={{
        padding: 10,
        margin: 10,
        backgroundColor: "#00061a",
        borderRadius: "30px",
      }}
    >
      <h1>{item.name}</h1>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "10px",
        }}
      >
        <div>
          <h2>{"Cantidad de Jugadores: " + item.players.length + "/4"}</h2>
          <p>{"Estado: " + item.state}</p>
          <p>{"Dueño: " + ownerName}</p>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
          }}
        >
          {isPrivate && item.players.length !== 4 && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "column",
              }}
            >
              {/* Input escondido para que el browser no sugiera contraseñas >:( */}
              <input type="password" style={{ display: "none" }} />
              <div style={{ display: "flex", flexDirection: "row" }}>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Ingresa una Contraseña"
                  value={password}
                  onChange={handleChangePassword}
                  maxLength={10}
                  autoComplete="off"
                  inputMode="text"
                  style={{ backgroundColor: "#1a1a1a" }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ marginLeft: "10px", fontSize: "12px" }}
                  disabled={password.length === 0}
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
                style={{
                  color: "white",
                  backgroundColor:
                    validUsername &&
                    item.state !== "started" &&
                    players !== 4 &&
                    ((isPrivate && validPassword && password.length !== 0) ||
                      !isPrivate)
                      ? "#0059b3"
                      : "red",
                  cursor:
                    validUsername &&
                    item.state !== "started" &&
                    players !== 4 &&
                    ((isPrivate && validPassword) || !isPrivate)
                      ? "pointer"
                      : "not-allowed",
                }}
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
