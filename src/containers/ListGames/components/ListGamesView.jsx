import React, { useContext } from "react";
import { UsernameContext } from "../../../contexts/UsernameContext";
import switcher_UI_UX_design_search_game_banner from "./switcher_UI_UX_desing_search_game_banner.svg";
import inputErrorNotification from "./errorInputNotificationAssett.svg";
import creatingGameErrorNotification from "./errorCreatingGameNotificationAssett.svg";
import border from "./switcher_UI_UX_assett_1.svg";
import "./ListGamesView.css";

const ListGamesView = ({
  setSearch,
  containerRef,
  isAtBottom,
  children,
  numPlayers,
  setNumPlayers,
}) => {
  const { username, validUsername, handleChangeUser } =
    useContext(UsernameContext);

  return (
    <>
      <div className="searchGamesContainer">
        <div className="searchGameMenuContainer">
          <div className="searchGameTitleContainer">
            <img
              className="searchGameTitleFront"
              src={switcher_UI_UX_design_search_game_banner}
            />
          </div>
          <div className="ayudador">
            <div className="searchGameInputMenuContainer">
              <h2>Buscar</h2>
              <input
                placeholder="Ingresa un Nombre"
                onChange={(e) => setSearch(e.target.value)}
              />
              <h2>Usuario:</h2>
              <input
                placeholder="Elige un Nombre"
                value={username}
                onChange={handleChangeUser}
              />
              {!validUsername && username.length > 0 && (
                <p>El nombre de usuario no es válido.</p>
              )}
              <h2>Numero de Jugadores:</h2>
              <div>
                {[1, 2, 3, 4].map((num) => (
                  <button
                    key={num}
                    onClick={() => {
                      numPlayers === num
                        ? setNumPlayers(null)
                        : setNumPlayers(num);
                    }}
                    className={`numPlayersButton ${
                      numPlayers === num ? "numPlayersButtonActive" : ""
                    }`}
                  >
                    {num}
                  </button>
                ))}
              </div>
            </div>
            <div className="searchGamesAvailableGamesDisplay">
              <div
                className="gameCards"
                data-testid="scrollable-div"
                ref={containerRef}
              >
                {children}
              </div>
              {isAtBottom && <div>No Hay Más Partidas</div>}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ListGamesView;
