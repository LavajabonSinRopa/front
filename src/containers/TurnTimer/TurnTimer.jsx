import React, { useState, useEffect } from "react";
import TurnTimerView from "./components/TurnTimerView.jsx";

const TurnTimer = ({ turnStart, playerId, gameId }) => {
    const [isLoading, setIsLoading] = useState(false);

    const sendEndTurnMessage = async (initiator = 'timer') => {
        setIsLoading(true);
        const data = {
            player_id: playerId,
        };

        try {
            const response = await fetch(`/api/games/${gameId}/skip`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });

            if (response.ok) {
                console.log(`Jugador ${playerId} ha terminado su turno por causa ${initiator}`);
            } else {
                console.error("Error al intentar terminar el turno");
            }
        } catch (error) {
            console.error("Error en la solicitud:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        const timer = setTimeout(() => sendEndTurnMessage(), 120000);
        return () => clearTimeout(timer); 
    }, [turnStart]); 

    return (
        <div>
            <TurnTimerView 
                isLoading={isLoading}
                timer = {timer}
            />
        </div>
    );
};

export default TurnTimer;
