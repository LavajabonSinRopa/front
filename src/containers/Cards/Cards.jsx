import React, { useEffect, useState, useContext, useRef } from "react";
import CardView from "./components/CardView.jsx";
import { UserIdContext } from "../../contexts/UserIdContext.jsx";
import "./components/Cards.css";
import { MovCardContext } from "../../contexts/MovCardContext.jsx";
import { FigCardContext } from "../../contexts/FigCardContext.jsx";
import { BlockFigCardContext } from "../../contexts/BlockFigCardContext.jsx";
import { MovementContext } from "../../contexts/MovementContext.jsx";

function Card({ playerData, isYourTurn }) {
  const [playerMovCards, setPlayerMovCards] = useState([]);
  const [playerFigCards, setPlayerFigCards] = useState([]);
  const { userId } = useContext(UserIdContext);
  const { movCardId, setMovCardId, movCardType, setMovCardType } =
    useContext(MovCardContext);
  const { figCardId, setFigCardId, figCardType, setFigCardType } =
    useContext(FigCardContext);
  const {
    blockFigCardId,
    setBlockFigCardId,
    blockFigCardType,
    setBlockFigCardType,
    opponentId,
    setOpponentId,
  } = useContext(BlockFigCardContext);
  const { setFirstPieceXaxis, setFirstPieceYaxis } = useContext(MovementContext);
  const blockFigTimeoutRef = useRef(null);
  const [errorBlockFig, setErrorBlockFig] = useState(false);

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
    setFigCardId(null);
    setFigCardType(null);
    setBlockFigCardId(null);
    setBlockFigCardType(null);
    setOpponentId(null);
  }, [isYourTurn]);

  if (!playerData) {
    return <div>Loading...</div>;
  }

  const handleUseMovCard = (e) => {
    if (userId === playerData.unique_id && isYourTurn) {
      const cardId = e.target.dataset.id;
      const cardType = e.target.dataset.type;
      const card = playerMovCards.find((card) => card.unique_id === cardId);

      setFigCardId(null);
      setFigCardType(null);
      setBlockFigCardId(null);
      setBlockFigCardType(null);
      setOpponentId(null);

      if (card && card.state !== "blocked") {
        if (movCardId === null || movCardType === null) {
          setMovCardId(cardId);
          setMovCardType(cardType);
        } else if (cardId === movCardId) {
          setFirstPieceXaxis(null);
          setFirstPieceYaxis(null);
          setMovCardId(null);
          setMovCardType(null);
        } else {
          setMovCardId(cardId);
          setMovCardType(cardType);
        }
      }
    }
  };

  const handleUseFigCard = (e) => {
    if (userId === playerData.unique_id && isYourTurn) {
      const cardId = e.target.dataset.id;
      const cardType = e.target.dataset.type;
      const card = playerFigCards.find((card) => card.unique_id === cardId);

      setMovCardId(null);
      setMovCardType(null);
      setBlockFigCardId(null);
      setBlockFigCardType(null);
      setOpponentId(null);

      if (card && card.state !== "blocked") {
        if (figCardId === null || figCardType === null) {
          setFigCardId(cardId);
          setFigCardType(cardType);
        } else if (cardId === figCardId) {
          setFigCardId(null);
          setFigCardType(null);
        } else {
          setFigCardId(cardId);
          setFigCardType(cardType);
        }
      }
    }
  };

  const useBlockFigCard = (e) => {
    if (userId !== playerData.unique_id && isYourTurn) {
      const cardId = e.target.dataset.id;
      const cardType = e.target.dataset.type;
      const isAnyCardBlocked = playerFigCards.some(
        (card) => card.state === "blocked"
      );
      
      setMovCardId(null);
      setMovCardType(null);
      setFigCardId(null);
      setFigCardType(null);

      if (!isAnyCardBlocked) {
        if (blockFigCardId === null || blockFigCardType === null) {
          setBlockFigCardId(cardId);
          setBlockFigCardType(cardType);
          setOpponentId(playerData.unique_id);
        } else if (cardId === blockFigCardId) {
          setBlockFigCardId(null);
          setBlockFigCardType(null);
          setOpponentId(null);
        } else if (cardId !== blockFigCardId) {
          setBlockFigCardId(cardId);
          setBlockFigCardType(cardType);
          setOpponentId(playerData.unique_id);
        }
      } else {
        setErrorBlockFig(true);
        if (blockFigTimeoutRef.current)
          clearTimeout(blockFigTimeoutRef.current);
        blockFigTimeoutRef.current = setTimeout(() => {
          setErrorBlockFig(false);
          setBlockFigCardId(null);
          setBlockFigCardType(null);
          setOpponentId(null);
        }, 500);
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
        useFigCard={handleUseFigCard}
        useBlockFigCard={useBlockFigCard}
        errorBlockFig={errorBlockFig}
      />
    </div>
  );
}

export default Card;
