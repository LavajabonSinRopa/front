//TurnTimerView.jsx
import React from "react";

const TurnTimerView = ({ timer, isLoading }) => {
    return (
        <div> 
            <h1>{isLoading ? "Finalizando turno..." : `Tiempo restante: ${timer}s`}</h1>
        </div>
    );
};

export default TurnTimerView;
