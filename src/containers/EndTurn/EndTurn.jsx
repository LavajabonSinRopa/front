// EndTurn.jsx
import React, { useState, useContext} from "react";
import { GamesContext } from "../../contexts/GamesContext.jsx";
import EndTurnView from "./components/EndTurnView.jsx";


function EndTurn({playerId, gameId, currentTurn}) {

    const handleEndTurn = async() => {
        const data = {
            player_id: playerId,
        };
        try {
            const response = await fetch(`api/games/${gameId}/skip`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
            });
    
            if (response.ok) {
                console.log(`Jugador ${playerId} ha terminado su turno`);
            } else {
                console.error("Error al intentar terminar el turno");
            }
        } catch (error) {
            console.error("Error en la solicitud:", error);
        }
    };
    return ( 
        <div>
            <EndTurnView 
                playerId={playerId} 
                currentTurn={currentTurn} 
                onPassTurn={handleEndTurn}
            />
        </div>
    );
}   

export default EndTurn;