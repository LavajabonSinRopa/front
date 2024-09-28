import React from 'react';

function PlayerItem({ player }) {
  return (
    <p><strong>{player.name}</strong> {player.isOwner && '(Owner)'}</p>
  );
}
export default PlayerItem;