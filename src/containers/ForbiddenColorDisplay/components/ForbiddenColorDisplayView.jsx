//ForbiddenColorDisplayView.jsx
import React from "react";

const ForbiddenColorDisplayView = ({ text, color }) => {
    return (
        <div style={{ color: color ? color : "#052d38", fontWeight: "bold", paddingLeft: "30px" }}>
            Color prohibido: {text}
        </div>
    );
};

export default ForbiddenColorDisplayView;
