import React, { useEffect, useState, useContext, useRef } from "react";
import { UserIdContext } from "../../contexts/UserIdContext.jsx";
import CardView from "./components/CardView.jsx";

function Card({ allPlayersCards }) {
  const { userId } = useContext(UserIdContext);
  const [playerMovCards, setPlayerMovCards] = useState([]);
  const [playerFigCards, setPlayerFigCards] = useState([]);
  const [allOponents, setAllOponents] = useState([]);

  useEffect(() => {
    const currentPlayer = allPlayersCards.find(
      (player) => player.unique_id === userId
    );
    console.log("CURRENT PLAYER:");
    console.log(currentPlayer);

    if (currentPlayer) {
      setPlayerFigCards(currentPlayer.figure_cards.slice(0, 3));
      setPlayerMovCards(currentPlayer.movement_cards);
    }

    const oponents = allPlayersCards.filter(
      (player) => player.unique_id !== userId
    );
    console.log("OPONENTS:");
    console.log(oponents);

    if (oponents) {
      setAllOponents(oponents);
    }
  }, [userId, allPlayersCards]); 

  return (
    <CardView
      movCards={playerMovCards}
      figCards={playerFigCards}
      oponents={allOponents}
    />
  );
}

export default Card;
