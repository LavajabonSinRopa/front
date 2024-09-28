import React from 'react';

/* Recibe un jugador y el id del owner de la partida, luego compara el id 
del player con el del owner para saber si lo resalta o no */
function PlayerItem({ player, ownerId }) {
  return (
    <p style={{ fontWeight: player.id === ownerId ? 'bold' : 'normal' }}>
      {player.name}
    </p>
  );
}
export default PlayerItem;