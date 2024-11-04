import React, { useState, useRef, useContext, useEffect } from "react";
import BoardView from "./componets/BoardView";
import { useParams } from "react-router-dom";
import { MovCardContext } from "../../contexts/MovCardContext.jsx";
import { MovementContext } from "../../contexts/MovementContext.jsx";
import { UserIdContext } from "../../contexts/UserIdContext.jsx";
import { FigCardContext } from "../../contexts/FigCardContext.jsx";
import { BlockFigCardContext } from "../../contexts/BlockFigCardContext.jsx";

const Board = ({ board, isYourTurn }) => {
  const { userId } = useContext(UserIdContext);
  const { game_id } = useParams();
  const [movError, setMovError] = useState(false);
  const [figError, setFigError] = useState(false);
  const movErrorTimeoutRef = useRef(null);
  const figErrorTimeoutRef = useRef(null);
  const [swappedPieces, setSwappedPieces] = useState([]);

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
    setOpponentId
  } = useContext(BlockFigCardContext);
  const {
    firstPieceXaxis,
    setFirstPieceXaxis,
    firstPieceYaxis,
    setFirstPieceYaxis,
    setSecondPieceXaxis,
    setSecondPieceYaxis,
  } = useContext(MovementContext);

  useEffect(() => {
    resetPieceSelection();
    setSwappedPieces([]);
  }, [isYourTurn, figCardId]);

  const resetPieceSelection = () => {
    setFirstPieceXaxis(null);
    setFirstPieceYaxis(null);
    setSecondPieceXaxis(null);
    setSecondPieceYaxis(null);
  };

  const handleTimeout = (errorSetter, timeoutRef) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => errorSetter(false), 500);
  };

  const getConnectedComponents = (grid, x, y, color) => {
    const visited = new Set();
    const directions = [
      [0, 1], //derecha
      [1, 0], //abajo
      [0, -1], //izquierda
      [-1, 0], //arriba
    ];
    const components = [];

    const dfs = (i, j) => {
      if (i < 0 || i >= grid.length || j < 0 || j >= grid[0].length) return;
      const sanitizedColor = color.replace(/%/g, "");
      const sanitizedGridElem = grid[i][j].replace(/%/g, "");
      if (
        visited.has(`${i},${j}`) ||
        !sanitizedGridElem.includes(sanitizedColor)
      )
        return;

      visited.add(`${i},${j}`);
      components.push([i, j]);

      directions.forEach(([dx, dy]) => dfs(i + dx, j + dy));
    };

    dfs(x, y);
    return components;
  };

  const handleMove = async (rowIndex, colIndex) => {
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

      if (!response.ok) {
        const errorDetails = await response.json();
        console.log("Detalles del error:", errorDetails);
        setMovError(true);
      } else {
        setMovCardId(null);
        setMovCardType(null);
        resetPieceSelection();
        setSwappedPieces((prev) => [
          ...prev,
          [firstPieceYaxis, firstPieceXaxis],
          [rowIndex, colIndex],
        ]);
      }
    } catch (error) {
      console.error("Error al realizar movimiento:", error);
    }
  };

  const handleMovSelection = async (rowIndex, colIndex) => {
    if (!isYourTurn) return;

    // Primer clic: seleccionar pieza inicial
    if (firstPieceXaxis === null || firstPieceYaxis === null) {
      setFirstPieceXaxis(colIndex);
      setFirstPieceYaxis(rowIndex);
      // Clic en la misma pieza: deseleccionar
    } else if (firstPieceXaxis === colIndex && firstPieceYaxis === rowIndex) {
      resetPieceSelection();
      // Clic en una posicion diferente con carta seleccionada: hacer el movimiento
    } else if (movCardId && movCardType) {
      setSecondPieceXaxis(colIndex);
      setSecondPieceYaxis(rowIndex);
      await handleMove(rowIndex, colIndex);
      // Clic en otra pieza sin tener una carta elegida: Seleccionar otra pieza
    } else if (!movCardId && !movCardType) {
      setFirstPieceXaxis(colIndex);
      setFirstPieceYaxis(rowIndex);
      // Cualquier otro caso: resetear seleccion
    } else {
      resetPieceSelection();
    }
    // Timer para animaciones de error en movimientos
    handleTimeout(setMovError, movErrorTimeoutRef);
  };

  const handleFigSelection = async (rowIndex, colIndex) => {
    if (!isYourTurn || rowIndex == null || colIndex == null) return;

    const data = {
      player_id: userId,
      card_id: figCardId,
      x: colIndex,
      y: rowIndex,
    };

    try {
      const response = await fetch(`/api/games/${game_id}/completeFigure`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorDetails = await response.json();
        console.log("Detalles del error:", errorDetails);
        setFigError(true);
      } else {
        setFigCardId(null);
        setFigCardType(null);
      }
    } catch (error) {
      console.error("Error al completar figura:", error);
    }
    // Timer para animaciones de error en figuras
    handleTimeout(setFigError, figErrorTimeoutRef);
  };

  const handleFigBlock = async (rowIndex, colIndex) => {
    if (!isYourTurn || rowIndex == null || colIndex == null) return;
    const data = {
      player_id: opponentId,
      card_id: blockFigCardId,
      x: colIndex,
      y: rowIndex,
    };

    try {
      const response = await fetch(`/api/games/${game_id}/blockFigure`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorDetails = await response.json();
        console.log("Detalles del error:", errorDetails);
        setFigError(true);
      } else {
        setBlockFigCardId(null);
        setBlockFigCardType(null);
      }
    } catch (error) {
      console.error("Error al bloquear figura:", error);
    }
    // Timer para animaciones de error en figuras
    handleTimeout(setFigError, figErrorTimeoutRef);
  };

  return (
    <BoardView
      board={board}
      handleMovSelection={handleMovSelection}
      handleFigSelection={handleFigSelection}
      handleFigBlock={handleFigBlock}
      movError={movError}
      figError={figError}
      swappedPieces={swappedPieces}
      getConnectedComponents={getConnectedComponents}
    />
  );
};

export default Board;
