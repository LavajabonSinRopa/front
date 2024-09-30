import React from "react";

const ListGamesView = ({ search, setSearch, containerRef, isAtBottom, children }) => {
  return (
    <div>
      <h1>Partidas disponibles</h1>
      <input
        placeholder="Ingresa un Nombre"
        onChange={(e) => setSearch(e.target.value)}
      />
      <button>Buscar</button>
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
