//EndTurnView.jsx
import React from "react";

const EndTurnView = ({
    isYourTurn,
    onPassTurn,
    isLoading,
    message,
}) => {
    return (
        <div>
            {message && 
            <div className="error-message">
                {message}
            </div>}
            <button onClick={onPassTurn} disabled={!isYourTurn || isLoading}>
                {isLoading ? "Cargando..." : isYourTurn ? "Terminar Turno" : "Esperando tu turno"}
            </button>
        </div>
    );
};

export default EndTurnView;
