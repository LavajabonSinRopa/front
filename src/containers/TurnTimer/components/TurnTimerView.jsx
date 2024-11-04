//TurnTimerView.jsx
import React from "react";

const TurnTimerView = ({
    timer,
    isLoading,
}) => {
    return (
        <div> 
            <h1 >
                {timer}
            </h1>
        </div>
    );
};

export default TurnTimerView;
