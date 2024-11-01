/*
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
  const [figError, setFigError] = useState(false);
  const movErrorTimeoutRef = useRef(null);
  const figErrorTimeoutRef = useRef(null);
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

  const getConnectedComponents = (grid, x, y, color) => {
    const visited = new Set();
    const directions = [
      [0, 1], // derecha
      [1, 0], // abajo
      [0, -1], // izquierda
      [-1, 0], // arriba
    ];

    const dfs = (i, j) => {
      if (i < 0 || i >= grid.length || j < 0 || j >= grid[0].length) return;
      if (visited.has(`${i},${j}`)) return;
      if (grid[i][j] !== color) return;

      visited.add(`${i},${j}`);
      components.push([i, j]);

      for (const [dx, dy] of directions) {
        dfs(i + dx, j + dy);
      }
    };

    const components = [];
    dfs(x, y);
    return components;
  };

  useEffect(() => {
    setFirstPieceXaxis(null);
    setFirstPieceYaxis(null);
    setSecondPieceXaxis(null);
    setSecondPieceYaxis(null);
    setSwappedPieces([]);
  }, [isYourTurn, figCardId]);

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
    if (movErrorTimeoutRef.current) {
      clearTimeout(movErrorTimeoutRef.current);
    }
    movErrorTimeoutRef.current = setTimeout(() => {
      setMovError(false);
    }, 500);
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
    };

    try {
      const response = await fetch(`/api/games/${game_id}/completeFigure`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      console.log(data);
      if (!response.ok) {
        const errorDetails = await response.json();
        console.log("Detalles del error:", errorDetails);
        setFigError(true);
      } else {
        setFigCardId(null);
        setFigCardType(null);
      }
      // Resetear estados tras un Figimiento exitoso
    } catch (error) {
      console.error("Error al completar figura:", error);
    } finally {
      console.log("Finalizó la acción.");
    }

    // Manejar timeout para el error
    if (figErrorTimeoutRef.current) {
      clearTimeout(figErrorTimeoutRef.current);
    }
    figErrorTimeoutRef.current = setTimeout(() => {
      setFigError(false);
    }, 500);
  }

  return (
    <>
      <BoardView
        board={board}
        handleMovSelection={handleMovSelection}
        handleFigSelection={handleFigSelection}
        movError={movError}
        figError={figError}
        swappedPieces={swappedPieces}
        getConnectedComponents={getConnectedComponents}
      />
    </>
  );
};

export default Board;
*/



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
  const [figError, setFigError] = useState(false);
  const movErrorTimeoutRef = useRef(null);
  const figErrorTimeoutRef = useRef(null);
  const [swappedPieces, setSwappedPieces] = useState([]);

  const { movCardId, setMovCardId, movCardType, setMovCardType } = useContext(MovCardContext);
  const { figCardId, setFigCardId, figCardType, setFigCardType } = useContext(FigCardContext);
  const { firstPieceXaxis, setFirstPieceXaxis, firstPieceYaxis, setFirstPieceYaxis, setSecondPieceXaxis, setSecondPieceYaxis } = useContext(MovementContext);

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
    const directions = [[0, 1], [1, 0], [0, -1], [-1, 0]];
    const components = [];

    const dfs = (i, j) => {
      if (i < 0 || i >= grid.length || j < 0 || j >= grid[0].length) return;
      if (visited.has(`${i},${j}`) || grid[i][j] !== color) return;

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

    if (firstPieceXaxis === null || firstPieceYaxis === null) {
      setFirstPieceXaxis(colIndex);
      setFirstPieceYaxis(rowIndex);
    } else if (firstPieceXaxis === colIndex && firstPieceYaxis === rowIndex) {
      resetPieceSelection();
    } else if (movCardId && movCardType) {
      setSecondPieceXaxis(colIndex);
      setSecondPieceYaxis(rowIndex);
      await handleMove(rowIndex, colIndex);
    } else if (!movCardId && !movCardType) {
      setFirstPieceXaxis(colIndex);
      setFirstPieceYaxis(rowIndex);
    } else {
      resetPieceSelection();
    }

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

    handleTimeout(setFigError, figErrorTimeoutRef);
  };

  return (
    <BoardView
      board={board}
      handleMovSelection={handleMovSelection}
      handleFigSelection={handleFigSelection}
      movError={movError}
      figError={figError}
      swappedPieces={swappedPieces}
      getConnectedComponents={getConnectedComponents}
    />
  );
};

export default Board;

