import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes, useParams } from "react-router-dom";
import Home from "./containers/HomePage/Home";
import CreatePartida from "./containers/CrearPartida/CrearPartida.jsx";
import ListGames from "./containers/ListGames/ListGames.jsx";
import GameLobbyContainer from "./containers/GameLobbyContainer/GameLobbyContainer.jsx";

// Componente wrapper para GameLobbyContainer
const GameLobbyWrapper = () => {
  const { game_id } = useParams(); // Extraer el game_id de la URL
  const playerID = ""; // Aquí podrías gestionar el estado del playerID si lo necesitas
  return <GameLobbyContainer gameId={game_id} playerId={playerID} />;
};

function App() {
  const [playerID, setPlayerID] = useState("");

  const handleDataFromChild = (childData) => {
    setPlayerID(childData);
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/creategame" element={<CreatePartida sendDataToParent={handleDataFromChild}/>}  />
        <Route path="/searchgame" element={<ListGames sendDataToParent={handleDataFromChild}/>}  />
        <Route
          path="/games/:game_id"
          element={<GameLobbyWrapper />} // Usa el wrapper aquí
        />
      </Routes>
    </Router>
  );
}

export default App;
