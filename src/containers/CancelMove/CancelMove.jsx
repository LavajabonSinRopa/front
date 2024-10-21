// CancelMove.jsx
import React, { useState} from "react";
import CancelMoveView from "./components/CancelMoveView.jsx";

function CancelMove({playerId, gameId, isYourTurn, partialMovementsMade}) {
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState(null);


    const handleCancelMove = async() => {
        const data = {
            player_id: playerId,
        };

        setIsLoading(true);
        setMessage(null);

        try {
            const response = await fetch(`/api/games/${gameId}/unmove`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
            });
    
            if (response.ok) {
                console.log(`Jugador ${playerId} ha cancelado el ultimo movimiento`);
            } else {
                setMessage("Error al cancelar movimiento");
                console.error("Error al cancelar movimiento");
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
            <CancelMoveView 
                isYourTurn = {isYourTurn}
                onCancelMove = {handleCancelMove}
                isLoading = {isLoading}
                message = {message}
                partialMovementsMade = {partialMovementsMade}

            />
        </div>
    );
}   

export default CancelMove;