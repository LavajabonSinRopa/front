import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import CrearPartidaView from "./components/CrearPartidaView";
import { UserIdContext } from "../../contexts/UserIdContext";

const CrearPartida = () => {
  const [username, setUsername] = useState("");
  const [validUsername, setValidUsername] = useState(false);
  const [name, setName] = useState("");
  const [validName, setValidName] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState("");
  const [validPassword, setValidPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { setUserId } = useContext(UserIdContext);
  const navigate = useNavigate();

  const handleChangeUser = (e) => {
    setMessage("");
    const newUsername = e.target.value;
    const isValid = /^[a-zA-Z0-9\s]*$/.test(newUsername) && newUsername.length <= 20 && newUsername.length > 0;
    setUsername(newUsername);

    if (newUsername.length > 20 || newUsername.trim() === "" || !isValid) {
      setValidUsername(false);
    } else {
      setValidUsername(true);
    }
  };

  const handleChangeInput = (e) => {
    setMessage("");
    const newName = e.target.value;
    const isValid = /^[a-zA-Z0-9\s]*$/.test(newName) && newName.length <= 20 && newName.length > 0;
    setName(newName);

    if (newName.length > 20 || newName.trim() === "" || !isValid) {
      setValidName(false);
    } else {
      setValidName(true);
    }
  };

  const handleChangePassword = (e) => {
    setMessage("");
    const newPassword = e.target.value;
    setPassword(newPassword);
    const isValidPassword =
      /^[a-zA-Z0-9]{0,10}$/.test(newPassword) && newPassword.length <= 10;
    setValidPassword(isValidPassword);
  };

  const handleSubmit = async () => {
    if (!validName || !validUsername || (!validPassword && password.length > 0)) return;
    
    const data = {
      game_name: name,
      player_name: username,
      password: password || "",
    };

    setLoading(true);

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
      setUserId(result.player_id);
      const gameId = result.game_id;

      setMessage("Creación de partida exitosa.");

      navigate(`/games/${gameId}`);

      console.log("Partida creada:", result);
    } catch (error) {
      console.error("Error al crear la partida:", error);
      setMessage("Hubo un problema al crear la partida, intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <CrearPartidaView
        username={username}
        validUserName={validUsername}
        name={name}
        validName={validName}
        message={message}
        loading={loading}
        password={password}
        validPassword={validPassword}
        showPassword={showPassword}
        onChangeUser={handleChangeUser}
        onChangeInput={handleChangeInput}
        onChangePassword={handleChangePassword}
        onSubmit={handleSubmit}
        setShowPassword={setShowPassword}
      />
    </>
  );
};

export default CrearPartida;
