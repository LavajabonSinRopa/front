import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './containers/HomePage/Home';
import CreatePartida from './containers/CrearPartida/CrearPartida.jsx'
import ListGames from './containers/ListGames/ListGames.jsx';
import Lobby from './containers/Lobby/Lobby.jsx';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/creategame" element={<CreatePartida />} />
        <Route path="/searchgame" element={<ListGames />} />
        <Route path="/games/:game_id" element={<Lobby />} /> {/* USA UNA RUTA DINAMICA */}
      </Routes>
    </Router>
  );
}

export default App;
