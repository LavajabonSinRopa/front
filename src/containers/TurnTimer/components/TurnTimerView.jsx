//TurnTimerView.jsx
import React from "react";
import "./TurnTimer.css";

const TurnTimerView = ({ timer, loading }) => {
    const minutes = Math.floor(timer / 60);
    const seconds = timer % 60;

    return (
        <div className="timer">
            {loading ? (
                <span>Finalizando turno...</span>
            ) : (
                <span>
                    Tiempo restante:{" "}
                    <b className={timer <= 10 ? "warning" : ""}>
                        {`${minutes}:${seconds.toString().padStart(2, '0')}`}
                    </b>
                </span>
            )}
        </div>
    );
};

export default TurnTimerView;
