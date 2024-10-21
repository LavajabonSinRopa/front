import React from "react";
import "./PiecesView.css";

const PiecesView = ({
  color,
  isSelected,
  moveableSlot,
  movError,
  isSwapped,
}) => {
  const isAFormedFigure = color === color.toUpperCase();
  const normalColor = color.toLowerCase();
  const buttonClass = `button 
  ${moveableSlot ? "moveableSlot" : ""} 
  ${normalColor ? normalColor : ""} 
  ${movError ? "movError" : ""} 
  ${isSelected ? "isSelected" : ""} 
  ${isSwapped ? "isSwapped" : ""} 
  ${isAFormedFigure ? "isAFormedFigure" : ""} 
  ${isSwapped && isAFormedFigure ? "isSwapped isAFormedFigure" : ""}`;

  return <button className={buttonClass}></button>;
};

export default PiecesView;
