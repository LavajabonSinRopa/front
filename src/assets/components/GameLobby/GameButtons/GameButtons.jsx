import React from 'react';

// Componente que maneja ambos botones
const GameButtons = ({ isOwner, onStartGame, onCancelGame, onLeaveGame }) => {
  return (
    <div>
      {/* Botón de "Iniciar Partida" solo visible para el owner */}
      {isOwner && (
        <button onClick={onStartGame}>
          Iniciar Partida
        </button>
      )}

      {/* Botón que cambia de "Cancelar Partida" a "Abandonar Partida" dependiendo de si es owner o jugador */}
      <button onClick={isOwner ? onCancelGame : onLeaveGame}>
        {isOwner ? 'Cancelar Partida' : 'Abandonar Partida'}
      </button>
    </div>
  );
};

export default GameButtons;
