import React, { useState, useEffect } from "react";
import TurnTimerView from "./components/TurnTimerView.jsx";

const TurnTimer = ({ initialTime }) => {
    const [secondsLeft, setSecondsLeft] = useState(initialTime);

    useEffect(() => {
        setSecondsLeft(initialTime); 

        const interval = setInterval(() => {
            setSecondsLeft(prev => {
                if (prev <= 1) {
                    clearInterval(interval); 
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [initialTime]);

    return (
        <div>
            <TurnTimerView 
                timer={secondsLeft}
            />
        </div>
    );
};

export default TurnTimer;
