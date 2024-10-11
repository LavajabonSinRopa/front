import React from "react";

const LeaveGameView = ({
    onLeaveGame,
}) => {
    return (
        <div>
            <button onClick={onLeaveGame}>
                Abandonar
            </button>
        </div>
    );
};

export default LeaveGameView;
