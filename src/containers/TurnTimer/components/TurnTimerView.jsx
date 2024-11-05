import React from "react";

const TurnTimerView = ({ timer }) => {
    const minutes = Math.floor(timer / 60);
    const seconds = timer % 60;

    return (
        <div className="timer">
            <span>Tiempo restante: <b>{`${minutes}:${seconds.toString().padStart(2, '0')}`}</b></span>
        </div>
    );
};

export default TurnTimerView;