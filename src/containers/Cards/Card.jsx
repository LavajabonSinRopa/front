import React, { useEffect, useState, useContext, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { UserIdContext } from "../../contexts/UserIdContext.jsx";
import CardView from "./components/CardView.jsx";

const Card = ({ movCards, showMovCards, figCards, showFigCards }) => {

  //ACA IRIA TODA LA LOGICA PARA USAR LAS CARTAS Y ESAS COSAS

  return (
    <CardView
      movCards={movCards}
      showMovCards={showMovCards}
      figCards={figCards}
      showFigCards={showFigCards}
    />
  );
};

export default Card;
