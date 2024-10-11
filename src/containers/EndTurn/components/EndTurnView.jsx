import React from "react";

const EndTurnView = ({
    playerId,
    currentTurn,
    onPassTurn,
}) => {
    const isYourTurn = playerId === playerId;

    return (
        <div>
            <button onClick={onPassTurn} disabled={!isYourTurn}>
                {isYourTurn ? "Terminar Turno" : "Esperando tu turno"}
            </button>
        </div>
    );
};

export default EndTurnView;
