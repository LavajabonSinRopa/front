import React, { useState, useEffect } from 'react';
//import { useWebSocket } from '../contexts/WebsocketContext';

const TurnInfo = () => {

//tengo que ver lo del web socket :/

//   const [turnInfo, setTurnInfo] = useState({
//     currentPlayer: '',
//     remainingTime: 0,
//     nextPlayer: '',
//   });

//   const socket = useWebSocket();

//   useEffect(() => {
//     //logica para conectarse al websocket y 
//     //recibir la informacion del turno en tiempo real
//     if (socket) {
//       //escucho los mensajes del websocket
//       socket.onmessage = (event) => {
//         const data = JSON.parse(event.data);
//         setTurnInfo({
//           currentPlayer: data.currentPlayer,
//           remainingTime: data.remainingTime,
//           nextPlayer: data.nextPlayer,
//         });
//       };
//     }
//   }, [socket]);

  return (
    <>
      <div className="turn-info">
        <h2>Turno Actual</h2>
        <p>Jugador actual: </p>
        <p>Tiempo restante: segundos</p>
        <p>Próximo jugador: </p>
      </div>
    </>
  );
};

export default TurnInfo;