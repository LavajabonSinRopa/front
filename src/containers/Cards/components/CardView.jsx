import React, { useContext } from "react";
import { UserIdContext } from "../../../contexts/UserIdContext.jsx";
import "./CardView.css";
import { MovCardContext } from "../../../contexts/MovCardContext.jsx";
import { FigCardContext } from "../../../contexts/FigCardContext.jsx";
import { BlockFigCardContext } from "../../../contexts/BlockFigCardContext.jsx";

import backMov from "./cardSVG/back-mov.svg";
import backFig from "./cardSVG/back.svg";
import fig01 from "./cardSVG/fig01.svg";
import fig02 from "./cardSVG/fig02.svg";
import fig03 from "./cardSVG/fig03.svg";
import fig04 from "./cardSVG/fig04.svg";
import fig05 from "./cardSVG/fig05.svg";
import fig06 from "./cardSVG/fig06.svg";
import fig07 from "./cardSVG/fig07.svg";
import fig08 from "./cardSVG/fig08.svg";
import fig09 from "./cardSVG/fig09.svg";
import fig10 from "./cardSVG/fig10.svg";
import fig11 from "./cardSVG/fig11.svg";
import fig12 from "./cardSVG/fig12.svg";
import fig13 from "./cardSVG/fig13.svg";
import fig14 from "./cardSVG/fig14.svg";
import fig15 from "./cardSVG/fig15.svg";
import fig16 from "./cardSVG/fig16.svg";
import fig17 from "./cardSVG/fig17.svg";
import fig18 from "./cardSVG/fig18.svg";
import fige01 from "./cardSVG/fige01.svg";
import fige02 from "./cardSVG/fige02.svg";
import fige03 from "./cardSVG/fige03.svg";
import fige04 from "./cardSVG/fige04.svg";
import fige05 from "./cardSVG/fige05.svg";
import fige06 from "./cardSVG/fige06.svg";
import fige07 from "./cardSVG/fige07.svg";
import mov1 from "./cardSVG/mov1.svg";
import mov2 from "./cardSVG/mov2.svg";
import mov3 from "./cardSVG/mov3.svg";
import mov4 from "./cardSVG/mov4.svg";
import mov5 from "./cardSVG/mov6.svg";
import mov6 from "./cardSVG/mov5.svg";
import mov7 from "./cardSVG/mov7.svg";

const figSvgMap = {
  0: fige01,
  1: fige02,
  2: fige03,
  3: fige04,
  4: fige05,
  5: fige06,
  6: fige07,
  7: fig01,
  8: fig02,
  9: fig03,
  10: fig04,
  11: fig05,
  12: fig06,
  13: fig07,
  14: fig08,
  15: fig09,
  16: fig10,
  17: fig11,
  18: fig12,
  19: fig13,
  20: fig14,
  21: fig15,
  22: fig16,
  23: fig17,
  24: fig18,
};

const movSvgMap = {
  0: mov1,
  1: mov2,
  2: mov3,
  3: mov4,
  4: mov5,
  5: mov6,
  6: mov7,
};

const CardView = ({ movCards, figCards, playerId, useMovCard, useFigCard, useBlockFigCard, errorBlockFig }) => {
  const { userId } = useContext(UserIdContext);
  const { movCardId } = useContext(MovCardContext);
  const { figCardId } = useContext(FigCardContext);
  const { blockFigCardId } = useContext(BlockFigCardContext);

  return (
    <div className="cardViewContainer">
      {movCards && (
        <>
          {Array.isArray(movCards) && movCards.length > 0 ? (
            <ul
              style={{ listStyleType: "none", padding: 0, margin: 0 }}
              className="grid-container"
            >
              {movCards.map((card, index) => (
                <li key={index} className="grid-item">
                  <img
                    className={"card"}
                    onClick={useMovCard}
                    data-id={card.unique_id}
                    data-type={card.type}
                    src={userId === playerId ? movSvgMap[card.type] : backMov}
                    style={{
                      transform:
                        movCardId === card.unique_id
                          ? "scale(1.5)"
                          : "scale(1)",
                      transition: "transform 0.3s ease-in-out",
                      filter:
                        card.state === "blocked" ? "grayscale(100%)" : "none",
                    }}
                  />
                </li>
              ))}
            </ul>
          ) : (
            <p>No hay cartas de movimiento</p>
          )}
        </>
      )}

      {figCards && (
        <>
          {Array.isArray(figCards) && figCards.length > 0 ? (
            <ul
              style={{ listStyleType: "none", padding: 0, margin: 0 }}
              className="grid-container"
            >
              {figCards.map((card, index) => (
                <li key={index} className="grid-item">
                  <img
                    className={`card ${errorBlockFig && userId !== playerId ? "errorBlockFig" : ""}`}
                    onClick={userId === playerId ? useFigCard : useBlockFigCard}
                    data-id={card.unique_id}
                    data-type={card.type}
                    src={card.state !== "blocked" ? figSvgMap[card.type] : backFig}
                    style={{
                      transform:
                        figCardId === card.unique_id || blockFigCardId === card.unique_id
                          ? "scale(1.5)"
                          : "scale(1)",
                      transition: "transform 0.3s ease-in-out",
                      filter:
                        card.state === "blocked" ? "grayscale(100%)" : "none",
                    }}
                  />
                </li>
              ))}
            </ul>
          ) : (
            <p>No hay cartas de figura</p>
          )}
        </>
      )}
    </div>
  );
};

export default CardView;
