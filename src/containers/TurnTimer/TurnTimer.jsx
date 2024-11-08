import React, { useState, useEffect } from "react";
import TurnTimerView from "./components/TurnTimerView.jsx";

const TurnTimer = ({ initialTime, playerId, gameId, isYourTurn }) => {
    const [secondsLeft, setSecondsLeft] = useState(initialTime);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        console.log("Nuevo time recibido:", initialTime);
        setSecondsLeft(initialTime);
    }, [initialTime]);

    useEffect(() => {
        if (secondsLeft <= 0) return;
        const interval = setInterval(() => {
            setSecondsLeft((prev) => {
                if (prev <= 0) {
                    clearInterval(interval); 
                    if (isYourTurn) {
                        handleEndTurn();
                    }
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [secondsLeft, isYourTurn]);

    const handleEndTurn = async () => {
        const data = { player_id: playerId };
        setIsLoading(true);

        try {
            const response = await fetch(`/api/games/${gameId}/skip`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });

            if (response.ok) {
                console.log(`Jugador ${playerId} ha terminado su turno por timer`);
                setSecondsLeft(15);
            } else {
                console.error("Error al intentar terminar el turno por timer");
            }
        } catch (error) {
            console.error("Error en la solicitud:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div>
            <TurnTimerView 
                timer={secondsLeft}
                loading={isLoading}
            />
        </div>
    );
};

export default TurnTimer;
