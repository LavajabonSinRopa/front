// LeaveGame.jsx
import React, { useState, useContext} from "react";
import { GamesContext } from "../../contexts/GamesContext.jsx";
import LeaveGameView from "./components/LeaveGameView.jsx";


function LeaveGame({playerId, gameId}) {

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
                console.log(`Jugador ${playerId} ha abandonado la partida en curso`);
            } else {
                console.error("Error al intentar abandonar la partida");
            }
        } catch (error) {
            console.error("Error en la solicitud:", error);
        }
    };
    return ( 
        <div>
            <LeaveGameView 
                onLeaveGame={handleLeaveGame}
            />
        </div>
    );
}   

export default LeaveGame;