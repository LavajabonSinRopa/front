import React, { useContext } from "react";
import { UsernameContext } from "../../../contexts/UsernameContext";

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
    <div>
      <h1>Partidas disponibles</h1>
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
            onClick={() => {numPlayers === num ? setNumPlayers(null) : setNumPlayers(num)}}
            style={{
              margin: "5px",
              backgroundColor: numPlayers === num ? "blue" : "",
            }}
          >
            {num}
          </button>
        ))}
      </div>
      <div
        data-testid="scrollable-div"
        ref={containerRef}
        style={{ height: "500px", overflowY: "auto", padding: "10px" }}
      >
        {children}
      </div>
      {isAtBottom && <div>No Hay Más Partidas</div>}
    </div>
  );
};

export default ListGamesView;
