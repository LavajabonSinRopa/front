import React, { useState, useEffect } from "react";
import BoardView from "./componets/BoardView";
import { useParams } from "react-router-dom";

const Board = ({board}) => {

  //ACA IRIA TODA LA LOGICA PARA FIGURAS BLOQUEADAS Y COSAS ASI

  return <BoardView board={board} />;
};

export default Board;