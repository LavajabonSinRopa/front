import React, {useContext} from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./containers/HomePage/Home";
import CreatePartida from "./containers/CrearPartida/CrearPartida.jsx";
import ListGames from "./containers/ListGames/ListGames.jsx";
import GameLobbyContainer from "./containers/GameLobbyContainer/GameLobbyContainer.jsx";
import { UserIdContext, UserIdProvider } from "./contexts/UserIdContext.jsx";
import StartGame from "./containers/StartGame/StartGame.jsx";
import { useParams } from "react-router-dom";

function App() {
  return (
    <UserIdProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/creategame" element={<CreatePartida />} />
          <Route path="/searchgame" element={<ListGames websocketUrl="apiWS/games"/>} />
          <Route path="/games/:game_id" element={<GameLobbyContainer />} />
          <Route path="/games/:game_id/start" element={<StartGameWrapper />} />
        </Routes>
      </Router>
    </UserIdProvider>
  );
}

function StartGameWrapper() {
  const { game_id } = useParams();
  const { userId } = useContext(UserIdContext);

  return <StartGame game_id={game_id} userId={userId} websocketUrl={`/apiWS/games/${game_id}/${userId}`} />;
}

export default App;
