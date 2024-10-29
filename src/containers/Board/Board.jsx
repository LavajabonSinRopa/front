import React, { useState, useRef, useContext, useEffect } from "react";
import BoardView from "./componets/BoardView";
import { useParams } from "react-router-dom";
import { MovCardContext } from "../../contexts/MovCardContext.jsx";
import { MovementContext } from "../../contexts/MovementContext.jsx";
import { UserIdContext } from "../../contexts/UserIdContext.jsx";
import { FigCardContext } from "../../contexts/FigCardContext.jsx";

const Board = ({ board, isYourTurn }) => {
  const { userId } = useContext(UserIdContext);
  const { game_id } = useParams();
  const [movError, setMovError] = useState(false);
  const timeoutRef = useRef(null);
  const [swappedPieces, setSwappedPieces] = useState([]);
  const { movCardId, setMovCardId, movCardType, setMovCardType } =
    useContext(MovCardContext);
  const { figCardId, setFigCardId, figCardType, setFigCardType } =
    useContext(FigCardContext);
  const {
    firstPieceXaxis,
    setFirstPieceXaxis,
    firstPieceYaxis,
    setFirstPieceYaxis,
    setSecondPieceXaxis,
    setSecondPieceYaxis,
  } = useContext(MovementContext);

  useEffect(() => {
    setFirstPieceXaxis(null);
    setFirstPieceYaxis(null);
    setSecondPieceXaxis(null);
    setSecondPieceYaxis(null);
    setSwappedPieces([]);
  }, [isYourTurn,figCardId]);

  async function handleMovSelection(rowIndex, colIndex) {
    if (!isYourTurn) return;

    const clearSelection = () => {
      setFirstPieceXaxis(null);
      setFirstPieceYaxis(null);
      setSecondPieceXaxis(null);
      setSecondPieceYaxis(null);
    };

    // Primer clic: seleccionar pieza inicial
    if (firstPieceXaxis == null || firstPieceYaxis == null) {
      setFirstPieceXaxis(colIndex);
      setFirstPieceYaxis(rowIndex);
    }
    // Clic en la misma pieza: deseleccionar
    else if (firstPieceXaxis === colIndex && firstPieceYaxis === rowIndex) {
      clearSelection();
    }
    // Clic en una posicion diferente con carta seleccionada: hacer el movimiento
    else if (
      (firstPieceXaxis !== colIndex || firstPieceYaxis !== rowIndex) &&
      movCardId &&
      movCardType
    ) {
      setSecondPieceXaxis(colIndex);
      setSecondPieceYaxis(rowIndex);

      const data = {
        player_id: userId,
        from_x: firstPieceXaxis,
        from_y: firstPieceYaxis,
        to_x: colIndex,
        to_y: rowIndex,
        card_id: movCardId,
      };

      try {
        const response = await fetch(`/api/games/${game_id}/move`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
        console.log(data);
        if (!response.ok) {
          const errorDetails = await response.json();
          console.log("Detalles del error:", errorDetails);
          setMovError(true);
        } else {
          setMovCardId(null);
          setMovCardType(null);
          clearSelection();

          setSwappedPieces((prevSwappedPieces) => [
            ...prevSwappedPieces,
            [firstPieceYaxis, firstPieceXaxis],
            [rowIndex, colIndex],
          ]);
        }
        // Resetear estados tras un movimiento exitoso
      } catch (error) {
        console.error("Error al realizar movimiento:", error);
      } finally {
        console.log("Finalizó la acción.");
      }
    }
    // Clic en otra pieza sin tener una carta elegida: Seleccionar otra pieza
    else if (
      (firstPieceXaxis !== colIndex || firstPieceYaxis !== rowIndex) &&
      movCardId === null &&
      movCardType === null
    ) {
      setFirstPieceXaxis(colIndex);
      setFirstPieceYaxis(rowIndex);
    }
    // Cualquier otro caso: resetear seleccion
    else {
      clearSelection();
    }

    // Manejar timeout para el error
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      setMovError(false);
    }, 2000);
  }

  async function handleFigSelection(rowIndex, colIndex) {
    if (!isYourTurn) return;

    if (rowIndex == null || colIndex == null) {
      return;
    }

    const data = {
      player_id: userId,
      card_id: figCardId,
      x: colIndex,
      y: rowIndex,
    };//game_id=game_id, player_id=request.player_id, card_id=request.card_id, i = request.y, j = request.x

    try {
      const response = await fetch(`/api/games/${game_id}/completeFigure`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      console.log("FIGURAAAAAAAAAAAAAAAAAAAaa");
      console.log(data);
      if (!response.ok) {
        const errorDetails = await response.json();
        console.log("Detalles del error:", errorDetails);
        setMovError(true);
      } else {
        setFigCardId(null);
        setFigCardType(null);
        const responseApplyMovs = await fetch(`/api/games/${game_id}/apply`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            player_id: userId,
          }),
        });
        if (!responseApplyMovs.ok) {
          const errorDetails = await responseApplyMovs.json();
          console.log("Detalles del error:", errorDetails);
          setMovError(true);
        } else {
          console.log("SE APLICARON LOS MOVIMIENTOS");
        }
      }
      // Resetear estados tras un movimiento exitoso
    } catch (error) {
      console.error("Error al realizar movimiento:", error);
    } finally {
      console.log("Finalizó la acción.");
    }

    // Manejar timeout para el error
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      setMovError(false);
    }, 2000);
  }

  return (
    <>
      <BoardView
        board={board}
        handleMovSelection={handleMovSelection}
        handleFigSelection={handleFigSelection}
        movError={movError}
        swappedPieces={swappedPieces}
      />
    </>
  );
};

export default Board;
