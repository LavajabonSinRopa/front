import React from 'react';
import '../VictoryScreen.css'; 

const VictoryScreenView = ({ winnerName, onMainMenu, isModalOpen, setIsModalOpen }) => {
    return (
        <div>
            {isModalOpen && (
              <div className="modal-overlay">
                  <div className="modal-content">
                      <button className="close-button" onClick={() => setIsModalOpen(false)}>×</button>
                      <h1> ¡{winnerName} ha ganado! </h1>
                      <div>
                          <button onClick={onMainMenu}>Volver al Menu Principal</button>
                      </div>
                  </div>
              </div>
            )}
        </div>
    );
};

export default VictoryScreenView;
