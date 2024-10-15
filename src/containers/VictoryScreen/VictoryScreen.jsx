//src/containers/VictoryScreen.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import VictoryScreenView from "./components/VictoryScreenView";

const VictoryScreen = ({ isGameOver, winner}) => {
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        if (isGameOver) {
            setIsModalOpen(true);
        }
    }, [isGameOver]);

    const handleMainMenu = () => {
        setIsModalOpen(false);
        navigate(`/`);
        console.log('Regresar al menu principal');
    };

    return (
        <>
            <VictoryScreenView 
                winnerName={winner}
                onMainMenu={handleMainMenu}
                isModalOpen={isModalOpen}
                setIsModalOpen={setIsModalOpen}
            />
        </>
    );
};

export default VictoryScreen;
