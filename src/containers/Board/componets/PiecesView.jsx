import React from "react";
import "./PiecesView.css";
import candado from "./candado.svg";

const PiecesView = ({
  color,
  isSelected,
  moveableSlot,
  movError,
  figError,
  isSwapped,
  isConnectedComponent,
  forbiddenColor,
}) => {
  const isInvolvedInPartialMovement = color.endsWith("%");
  if (isInvolvedInPartialMovement) {
    color = color.slice(0, -1);
  }
  const isAFormedFigure =
    color === color.toUpperCase() && color.toLowerCase() !== forbiddenColor; // Si el color viene todo en mayusculas, es una figura formada y se resalta en el tablero
  const normalColor = color.toLowerCase(); //ficha común, no se resalta

  const buttonClass = `button 
  ${moveableSlot ? "moveableSlot" : ""} 
  ${normalColor ? normalColor : ""} 
  ${movError ? "movError" : ""} 
  ${figError ? "figError" : ""} 
  ${isSelected ? "isSelected" : ""} 
  ${isAFormedFigure ? "isAFormedFigure" : ""} 
  ${isConnectedComponent ? "isConnectedComponent" : ""} 
  ${isInvolvedInPartialMovement ? "isSwapped" : ""}`;

  return (
    <button className={buttonClass}>
      {color.toLowerCase().includes(forbiddenColor) && <img src={candado} className="candado"/>}
    </button>
  );
};

export default PiecesView;
