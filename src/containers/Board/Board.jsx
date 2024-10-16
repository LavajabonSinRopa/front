import React, { useState, useEffect } from "react";
import BoardView from "./componets/BoardView";
import { useParams } from "react-router-dom";

const Board = () => {
  const [board, setBoard] = useState("");
  const { game_id } = useParams();
  console.log(game_id);
  const websocketURL = `/apiWS/games`;

  const fecthInicial = async () => {
    const response = await fetch(`/api/games/${game_id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      console.log("Hubo un problema al crear la partida, intenta de nuevo.");
      return;
    }

    const result = await response.json();
    console.log(result);
    setBoard(result.board);
  };

  useEffect(() => {
    fecthInicial();
  }, [])
  
/*
  useEffect(() => {
    const socket = new WebSocket(websocketURL);

    socket.onopen = () => {
      console.log("Conexión abierta");
    };

    socket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      console.log(message);
      const payload = message.payload;
      //if (message.type === "gameStart") {
      //if (payload.state === "started") {
      setBoard(payload.board);
      //}
      //}
    };

    return () => {
      socket.close();
    };
  }, [websocketURL]);
*/
  return <BoardView board={board} />;
};

export default Board;