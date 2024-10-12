// LeaveGame.jsx
import React, { useState, useContext } from "react";
import { GamesContext } from "../../contexts/GamesContext.jsx";
import LeaveGameView from "./components/LeaveGameView.jsx";

function LeaveGame({ playerId, gameId }) {
    const [message, setMessage] = useState(null);
    // const { updateGameState } = useContext(GamesContext);

    const handleLeaveGame = async() => {
        const data = {
            player_id: playerId,
        };
        try {
            const response = await fetch(`api/games/${gameId}/leave`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });

            if (response.ok) {
                setMessage(`Jugador ${playerId} ha abandonado la partida.`);
                console.log(`Jugador ${playerId} ha abandonado la partida en curso`);
                //updateGameState(gameId);
            } else {
                const errorData = await response.json();
                setMessage(`Error: ${errorData.message || "Error al intentar abandonar la partida"}`);
                console.error("Error al intentar abandonar la partida", errorData);
            }
        } catch (error) {
            setMessage("Error en la solicitud. Inténtalo nuevamente.");
            console.error("Error en la solicitud:", error);
        }
    };
    
    return (
        <div>
            <LeaveGameView onLeaveGame={handleLeaveGame} />
            {message && <p>{message}</p>}
        </div>
    );
}

export default LeaveGame;