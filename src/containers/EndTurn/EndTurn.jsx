// EndTurn.jsx
import React, { useState} from "react";
import EndTurnView from "./components/EndTurnView.jsx";

function EndTurn({playerId, gameId, isYourTurn}) {
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState(null);


    const handleEndTurn = async() => {
        const data = {
            player_id: playerId,
        };

        setIsLoading(true);
        setMessage(null);

        try {
            const response = await fetch(`/api/games/${gameId}/skip`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
            });
    
            if (response.ok) {
                console.log(`Jugador ${playerId} ha terminado su turno`);
            } else {
                setMessage("Error al intentar terminar el turno");
                console.error("Error al intentar terminar el turno");
            }
        } catch (error) {
            setMessage("Error en la solicitud: " + error.message);
            console.error("Error en la solicitud:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return ( 
        <div>
            <EndTurnView 
                isYourTurn = {isYourTurn}
                onPassTurn = {handleEndTurn}
                isLoading = {isLoading}
                message = {message}

            />
        </div>
    );
}   

export default EndTurn;