import React, { useContext, useState } from "react";
import PiecesView from "./PiecesView";
import "./BoardView.css";
import { MovementContext } from "../../../contexts/MovementContext";
import { MovCardContext } from "../../../contexts/MovCardContext";
import { FigCardContext } from "../../../contexts/FigCardContext";
import { BlockFigCardContext } from "../../../contexts/BlockFigCardContext";

const BoardView = ({
  board,
  handleMovSelection,
  handleFigSelection,
  handleFigBlock,
  movError,
  figError,
  swappedPieces,
  getConnectedComponents,
  forbiddenColor,
}) => {
  const [connectedComponents, setConnectedComponents] = useState([]);
  const [selectedFigPosition, setSelectedFigPosition] = useState({
    row: null,
    col: null,
  });

  const {
    firstPieceXaxis,
    firstPieceYaxis,
    secondPieceXaxis,
    secondPieceYaxis,
  } = useContext(MovementContext);
  const { movCardId, movCardType } = useContext(MovCardContext);
  const { figCardId } = useContext(FigCardContext);
  const { blockFigCardId } = useContext(BlockFigCardContext);

  function isMoveableSlot(xAxis, yAxis) {
    let isMoveable = false;
    const dx = xAxis - firstPieceXaxis;
    const dy = yAxis - firstPieceYaxis;
    if (firstPieceXaxis !== null && firstPieceYaxis !== null) {
      // Diagonal larga
      if (movCardType === "0") {
        isMoveable = Math.abs(dx) === 2 && Math.abs(dy) === 2;
        // Linea mediana
      } else if (movCardType === "1") {
        isMoveable =
          (Math.abs(dx) === 2 && Math.abs(dy) === 0) ||
          (Math.abs(dx) === 0 && Math.abs(dy) === 2);
        // Linea corta
      } else if (movCardType === "2") {
        isMoveable =
          (Math.abs(dx) === 1 && Math.abs(dy) === 0) ||
          (Math.abs(dx) === 0 && Math.abs(dy) === 1);
        // Diagonal corta
      } else if (movCardType === "3") {
        isMoveable = Math.abs(dx) === 1 && Math.abs(dy) === 1;
        // L invertida
      } else if (movCardType === "4") {
        isMoveable =
          (dx === -2 && dy === 1) ||
          (dx === 2 && dy === -1) ||
          (dx === 1 && dy === 2) ||
          (dx === -1 && dy === -2);
        // L normal
      } else if (movCardType === "5") {
        isMoveable =
          (dx === 2 && dy === 1) ||
          (dx === -2 && dy === -1) ||
          (dx === -1 && dy === 2) ||
          (dx === 1 && dy === -2);
        // Linea larga
      } else if (movCardType === "6") {
        isMoveable =
          (Math.abs(dx) === 4 && Math.abs(dy) === 0) ||
          (Math.abs(dx) === 0 && Math.abs(dy) === 4);
      }
    }
    return isMoveable;
  }

  const handleSelection = (rowIndex, colIndex) => {
    if (figCardId !== null) {
      handleFigSelection(rowIndex, colIndex);
      setSelectedFigPosition({ row: rowIndex, col: colIndex });
    } else if (blockFigCardId !== null) {
      handleFigBlock(rowIndex, colIndex);
      setSelectedFigPosition({ row: rowIndex, col: colIndex });
    } else if (movCardId !== null) {
      handleMovSelection(rowIndex, colIndex);
    } else {
      console.log("Error: No se ha seleccionado ninguna carta");
    }
  };

  const isErrorInMove = (rowIndex, colIndex) =>
    movError &&
    ((firstPieceXaxis === colIndex && firstPieceYaxis === rowIndex) ||
      (secondPieceXaxis === colIndex && secondPieceYaxis === rowIndex));

  const isErrorInFig = (rowIndex, colIndex) =>
    figError &&
    connectedComponents.some(([i, j]) => i === rowIndex && j === colIndex) &&
    connectedComponents.some(
      ([i, j]) => i === selectedFigPosition.row && j === selectedFigPosition.col
    );

  const isSwappedPosition = (rowIndex, colIndex) =>
    swappedPieces.some(([x, y]) => x === rowIndex && y === colIndex);

  const isConnectedPosition = (rowIndex, colIndex) =>
    figCardId !== null &&
    connectedComponents.some(([i, j]) => i === rowIndex && j === colIndex);

  if (board.length !== 6 || board.some((row) => row.length !== 6)) {
    return <h1>ERROR: FORMATO DE TABLERO INCORRECTO</h1>;
  }

  return (
    <div className="board">
      {board.map((row, rowIndex) => (
        <div key={rowIndex} className="row">
          {row.map((char, colIndex) => (
            <div
              key={colIndex}
              className="piece"
              onClick={() => handleSelection(rowIndex, colIndex)}
              onMouseEnter={() =>
                setConnectedComponents(
                  getConnectedComponents(board, rowIndex, colIndex, char)
                )
              }
              onMouseLeave={() => setConnectedComponents([])}
            >
              <PiecesView
                color={char}
                isSelected={
                  firstPieceXaxis === colIndex && firstPieceYaxis === rowIndex
                }
                moveableSlot={isMoveableSlot(colIndex, rowIndex)}
                movError={isErrorInMove(rowIndex, colIndex)}
                figError={isErrorInFig(rowIndex, colIndex)}
                isSwapped={isSwappedPosition(rowIndex, colIndex)}
                isConnectedComponent={isConnectedPosition(rowIndex, colIndex)}
                forbiddenColor={forbiddenColor}
              />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default BoardView;
