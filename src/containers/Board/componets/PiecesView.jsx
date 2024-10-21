import React from "react";
import "./PiecesView.css";

const PiecesView = ({ color, isSelected, moveableSlot, movError }) => {
  const buttonClass = `button  ${color ? color : ""} ${movError ? "movError" : ""} ${
    isSelected ? "isSelected" : ""
  } ${moveableSlot ? "moveableSlot" : ""}`;

  return <button className={buttonClass}></button>;
};

export default PiecesView;
