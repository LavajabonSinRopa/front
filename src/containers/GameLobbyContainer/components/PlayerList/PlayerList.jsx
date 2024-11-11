import React from "react";
import "./PlayerList.css";

function PlayerList({ playerList, ownerId }) {
  if (!playerList || playerList.length === 0) {
    return <p>No hay jugadores disponibles.</p>;
  }

  return (
    <div className="lobbyPlayerListContainer">
      <h3 className="lobbyPlayerListTitle" style={{margin: "0px"}}>Jugadores</h3>
      <ul style={{ listStyleType: "none", padding: 0, margin: 0 }}>
        {playerList.map(([id, name]) => (
            <li
            className="lobbyPlayerListItem"
              key={id}
              style={{ fontWeight: ownerId === id ? "bold" : "normal" }}
            >
              {name}
            </li>
          )
        )}
      </ul>
    </div>
  );
}

export default PlayerList;
