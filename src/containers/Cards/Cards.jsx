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
      const cardId = e.target.dataset.id;
      const cardType = e.target.dataset.type;
      const card = playerMovCards.find((card) => card.unique_id === cardId);

      console.log("card and card state:");
      console.log(card);
      console.log(card.state);

      if (card && card.state !== "blocked") {
        if (movCardId === null || movCardType === null) {
          setMovCardId(cardId);
          setMovCardType(cardType);
        } else if (cardId === movCardId) {
          setMovCardId(null);
          setMovCardType(null);
        } else {
          setMovCardId(cardId);
          setMovCardType(cardType);
        }
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
