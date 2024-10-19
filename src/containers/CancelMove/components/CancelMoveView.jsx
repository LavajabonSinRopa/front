//CancelMoveView.jsx
import React from "react";

const CancelMoveView = ({
    isYourTurn,
    onCancelMove,
    isLoading,
    message,
}) => {
    return (
        <div>
            {message && 
            <div className="error-message">
                {message}
            </div>}
            <button onClick={onCancelMove} disabled={!isYourTurn || isLoading}>
                {isLoading ? "Cargando..." : isYourTurn ? "Cancelar Movimiento" : "Esperando tu turno"}
            </button>
        </div>
    );
};

export default CancelMoveView;
