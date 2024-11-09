import React from 'react';
import './GameInfo.css';

const GameInfo = ({ turnNumber, players, currentPlayerId, userId }) => {
  return (
    <div className="game-info">
      <h2>Turno: {turnNumber}</h2>
      <div className="players-info">
        <span>Jugadores en partida: </span>
        {players.map((player, index) => (
          <span key={player.unique_id}>
            <span style={{ fontWeight: player.unique_id === userId ? 'bold' : 'normal' }}>
              {player.name}
            </span>
            {index < players.length - 1 && ' • '}
          </span>
        ))}
      </div>
      <div className="current-turn">
        <span>Es el turno de {players.find(p => p.unique_id === currentPlayerId)?.name || 'otro jugador'}</span>
      </div>
    </div>
  );
};

export default GameInfo;