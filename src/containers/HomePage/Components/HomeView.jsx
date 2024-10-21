// HomeView.js
import React from "react";
import "./HomeView.css";
import switcher_UI_UX_desing_banner from "./switcher_UI_UX_desing_banner.svg";
import switcherAnimado from "./SwitcherAnimado.svg";
import backgroundPolygon1 from "./backgroundPolygon1.svg";
import shadow from "./shadow.svg"

function HomeView({ onNavigate }) {
  return (
    <>
      <div className="homeContainer">
      <img className={"backgroundPolygon1"} src={backgroundPolygon1} />
      <img className={"shadow"} src={shadow} />
        <div className="frame"></div>
        <div className="homeColumn1">
          <img
            className={"switcher_UI_UX_desing_banner"}
            src={switcher_UI_UX_desing_banner}
          />
          <button
            className="homeButton"
            onClick={() => onNavigate("/creategame")}
          >
            Crear Partida
          </button>
          <button
            className="homeButton"
            onClick={() => onNavigate("/searchgame")}
          >
            Buscar Partida
          </button>
        </div>
        <div className="homeColumn2">
          <img className={"switcherAnimado"} src={switcherAnimado} />
        </div>
      </div>
      
      <div className="homeBackground"></div>
    </>
  );
}

export default HomeView;
