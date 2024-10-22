//CancelMoveView.jsx
import React from "react";

const CancelMoveView = ({
    isYourTurn,
    onCancelMove,
    isLoading,
    message,
    partialMovementsMade
}) => 
    {
    return (
        <div>
            {message && 
            <div className="error-message">
                {message}
            </div>}
            <button onClick={onCancelMove} disabled={!isYourTurn || isLoading || !partialMovementsMade}>
                {isLoading ? "Cargando..." : "Cancelar Movimiento"}
            </button>
        </div>
    );
};

export default CancelMoveView;
