import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./containers/HomePage/Home";
import CreatePartida from "./containers/CrearPartida/CrearPartida.jsx";
import ListGames from "./containers/ListGames/ListGames.jsx";
import GameLobbyContainer from "./containers/GameLobbyContainer/GameLobbyContainer.jsx";
import { UserIdProvider } from "./contexts/UserIdContext.jsx";

function App() {
  return (
    <UserIdProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/creategame" element={<CreatePartida />} />
          <Route path="/searchgame" element={<ListGames />} />
          <Route path="/games/:game_id" element={<GameLobbyContainer />} />
        </Routes>
      </Router>
    </UserIdProvider>
  );
}

export default App;
