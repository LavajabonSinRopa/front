import React from 'react';
import './GameInfo.css';

const GameInfo = ({ turnNumber, players, currentPlayerId, userId }) => {
  return (
    <div className="game-info">
      <h2 style={{color: "#052d38"}}>Turno: {turnNumber}</h2>
      <div className="players-info">
        <span style={{color: "#052d38"}}>Jugadores en partida: </span>
        {players.map((player, index) => (
          <span style={{color: "#052d38"}} key={player.unique_id}>
            <span style={{ fontWeight: player.unique_id === userId ? 'bold' : 'normal'}}>
              {player.name}
            </span >
            {index < players.length - 1 && ' • '}
          </span>
        ))}
      </div>
      <div className="current-turn">
        <span style={{color: "#052d38"}}>Es el turno de {players.find(p => p.unique_id === currentPlayerId)?.name || 'otro jugador'}</span>
      </div>
    </div>
  );
};

export default GameInfo;