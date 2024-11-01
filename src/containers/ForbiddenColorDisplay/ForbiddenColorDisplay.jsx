import React, { useEffect, useState } from "react";
import ForbiddenColorDisplayView from "./components/ForbiddenColorDisplayView";

function ForbiddenColorDisplay({ color }) {
    const [colorMessage, setColorMessage] = useState('');

    useEffect(() => {
        switch (color) {
            case 'red':
                setColorMessage('Rojo');
                break;
            case 'green':
                setColorMessage('Verde');
                break;
            case 'blue':
                setColorMessage('Azul');
                break;
            case 'yellow':
                setColorMessage('Amarillo');
                break;
            default:
                setColorMessage('Ninguno');
        }
    }, [color]);

    return ( 
        <div>
            <ForbiddenColorDisplayView text={colorMessage} color={color} />
        </div>
    );
}   

export default ForbiddenColorDisplay;
