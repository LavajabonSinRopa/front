import React from "react";

function PlayerList({ playerList, ownerId }) {

    if (!playerList || playerList.length === 0) {
        return <p>No hay jugadores disponibles.</p>;
    }

    return (
        <>
            <h3>Jugadores</h3>
            <ul style={{ listStyleType: "none", padding: 0, margin: 0 }}>
                {playerList.map((player) => (
                    <li
                        key={player}
                        style={{ fontWeight: ownerId === player ? "bold" : "normal" }}
                    >
                        {player}
                    </li>
                ))}
            </ul>
        </>
    );
}

export default PlayerList;
