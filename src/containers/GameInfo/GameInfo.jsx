import React from 'react';
import './GameInfo.css';

const GameInfo = ({ turnNumber, players, currentPlayerId }) => {
  return (
    <div className="game-info">
      <h2>Turn: {turnNumber}</h2>
      <div className="players-info">
        <span>Players: </span>
        {players.map((player, index) => (
          <React.Fragment key={player.unique_id}>
            <span 
              style={{ 
                fontWeight: player.unique_id === currentPlayerId ? 'bold' : 'normal',
                marginRight: '8px'
              }}
            >
              {player.name}
            </span>
            {index < players.length - 1 && <span>•</span>}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default GameInfo;