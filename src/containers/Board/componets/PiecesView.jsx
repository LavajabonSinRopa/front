import React from "react";
import "./PiecesView.css";

const PiecesView = ({
  color,
  isSelected,
  moveableSlot,
  movError,
  isSwapped,
}) => {
  const isInvolvedInPartialMovement = color.endsWith("%");
  if (isInvolvedInPartialMovement) {
    color = color.slice(0, -1);
  }
  const isAFormedFigure = color === color.toUpperCase(); // Si el color viene todo en mayusculas, es una figura formada y se resalta en el tablero
  const normalColor = color.toLowerCase(); //ficha común, no se resalta

  const buttonClass = `button 
  ${moveableSlot ? "moveableSlot" : ""} 
  ${normalColor ? normalColor : ""} 
  ${movError ? "movError" : ""} 
  ${isSelected ? "isSelected" : ""} 
  ${isAFormedFigure ? "isAFormedFigure" : ""} 
  ${isInvolvedInPartialMovement ? "isSwapped" : ""}`;
  

  return <button className={buttonClass}></button>;
};

export default PiecesView;
