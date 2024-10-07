import React from "react";

function PlayerList({ playerList, ownerId }) {
  if (!playerList || playerList.length === 0) {
    return <p>No hay jugadores disponibles.</p>;
  }

  return (
    <>
      <h3>Jugadores</h3>
      <ul style={{ listStyleType: "none", padding: 0, margin: 0 }}>
        {playerList.map(([id, name]) => (
            <li
              key={id}
              style={{ fontWeight: ownerId === id ? "bold" : "normal" }}
            >
              {name}
            </li>
          )
        )}
      </ul>
    </>
  );
}

export default PlayerList;
