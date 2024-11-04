import React, { useState, useEffect } from "react";
import TurnTimerView from "./components/TurnTimerView.jsx";

const TurnTimer = ({ turnStart, playerId, gameId }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [secondsLeft, setSecondsLeft] = useState(120);

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
        setSecondsLeft(120); 

        const interval = setInterval(() => {
            setSecondsLeft(prev => {
                if (prev <= 1) {
                    sendEndTurnMessage();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [turnStart]);

    return (
        <div>
            <TurnTimerView 
                timer = {secondsLeft}
                isLoading={isLoading}
            />
        </div>
    );
};

export default TurnTimer;
