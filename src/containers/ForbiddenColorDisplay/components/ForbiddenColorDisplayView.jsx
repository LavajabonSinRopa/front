//ForbiddenColorDisplayView.jsx
import React from "react";

const ForbiddenColorDisplayView = ({ text, color }) => {
    return (
        <div style={{ color: color, fontWeight: "bold" }}>
            Color prohibido: {text}
        </div>
    );
};

export default ForbiddenColorDisplayView;
