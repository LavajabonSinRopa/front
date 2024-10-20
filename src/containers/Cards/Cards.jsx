import React, { useEffect, useState, useContext } from "react";
import CardView from "./components/CardView.jsx";
import { UserIdContext } from "../../contexts/UserIdContext.jsx";
import "./components/Cards.css";
import { MovCardContext } from "../../contexts/MovCardContext.jsx";

function Card({ playerData, isYourTurn }) {
  const [playerMovCards, setPlayerMovCards] = useState([]);
  const [playerFigCards, setPlayerFigCards] = useState([]);
  const { userId } = useContext(UserIdContext);
  const { movCardId, setMovCardId, movCardType, setMovCardType } =
    useContext(MovCardContext);

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

  useEffect(() => {
    setMovCardId(null);
    setMovCardType(null);
  }, [isYourTurn]);

  if (!playerData) {
    return <div>Loading...</div>;
  }

  const handleUseMovCard = (e) => {
    if (userId === playerData.unique_id && isYourTurn) {
      if (movCardId === null || movCardType === null) {
        setMovCardId(e.target.dataset.id);
        setMovCardType(e.target.dataset.type);
      } else if (e.target.dataset.id === movCardId) {
        setMovCardId(null);
        setMovCardType(null);
      } else {
        setMovCardId(e.target.dataset.id);
        setMovCardType(e.target.dataset.type);
      }
    }
  };

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
        useMovCard={handleUseMovCard}
      />
    </div>
  );
}

export default Card;
