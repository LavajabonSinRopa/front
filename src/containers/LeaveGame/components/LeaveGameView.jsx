import React, { useState } from "react";

const LeaveGameView = ({ onLeaveGame }) => {
    const [isLeaving, setIsLeaving] = useState(false);

    const handleClick = async () => {
        setIsLeaving(true);
        await onLeaveGame();
        setIsLeaving(false); 
    };

    return (
        <div>
            <button 
                onClick={handleClick} 
                disabled={isLeaving}
                aria-label="Abandonar la partida"
            >
                {isLeaving ? "Saliendo..." : "Abandonar"}
            </button>
        </div>
    );
};

export default LeaveGameView;
