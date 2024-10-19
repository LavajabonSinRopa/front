import React, { useEffect, useState, useContext, useRef } from "react";
import CardView from "./components/CardView.jsx";
import { UserIdContext } from "../../contexts/UserIdContext.jsx";
import "./components/Cards.css";

function Card({ playerData }) {
  const [playerMovCards, setPlayerMovCards] = useState([]);
  const [playerFigCards, setPlayerFigCards] = useState([]);
  const { userId } = useContext(UserIdContext);

  useEffect(() => {
    if (
      playerData &&
      typeof playerData === "object" &&
      Object.keys(playerData).length !== 0
    ) {
      setPlayerFigCards(playerData.figure_cards.slice(0, 3));
      setPlayerMovCards(playerData.movement_cards);
    }
  }, [playerData]);

  // Verifica si playerData está definido antes de intentar renderizar CardView
  if (!playerData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="cardContainer">
      <h1 className="playerName">
        {userId === playerData.unique_id
          ? "TUS CARTAS"
          : `CARTAS DE ${playerData.name}`}
      </h1>
      <CardView
        movCards={playerMovCards}
        figCards={playerFigCards}
        playerId={playerData.unique_id}
      />
    </div>
  );
}

export default Card;
