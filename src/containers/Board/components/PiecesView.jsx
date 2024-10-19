import React from "react";
import "./PiecesView.css";

const PiecesView = ({ color, isFigure = 1 }) => {
  let buttonClass;

  switch (color) {
    case "red":
      if (isFigure) {
        buttonClass = "button red isFigure";
      } else {
        buttonClass = "button red";
      }

      break;
    case "green":
      if (isFigure) {
        buttonClass = "button green isFigure";
      } else {
        buttonClass = "button green";
      }

      break;
    case "blue":
      if (isFigure) {
        buttonClass = "button blue isFigure";
      } else {
        buttonClass = "button blue";
      }

      break;
    case "yellow":
      if (isFigure) {
        buttonClass = "button yellow isFigure";
      } else {
        buttonClass = "button yellow";
      }

      break;
    default:
      buttonClass = "button"; // Clase base
      break;
  }

  return <button className={buttonClass}></button>;
};

export default PiecesView;
