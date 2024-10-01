import React from "react";
import { useParams } from "react-router-dom";

const Lobby = () => {
  const { game_id } = useParams();  // Obtiene el game_id de la URL

  return (
    <div>
      <h1>ESTÁS DENTRO DEL LOBBY</h1>
      <p>Partida ID: {game_id}</p>
    </div>
  );
};

export default Lobby;
