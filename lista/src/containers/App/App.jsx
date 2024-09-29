import React, { useState, useEffect, useRef } from "react";
import "./components/App.css";
import { GenericList } from "../GenericList";
import { renderItem } from "./components/AppRenderItem";

function App() {
  const [search, setSearch] = useState("");

  const containerRef = useRef(null);
  const [isAtBottom, setIsAtBottom] = useState(false);

  const handleScroll = () => {
    const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
    if (scrollTop + clientHeight >= scrollHeight) {
      setIsAtBottom(true);
    } else {
      setIsAtBottom(false);
    }
  };

  useEffect(() => {
    const container = containerRef.current;
    container.addEventListener("scroll", handleScroll);

    return () => {
      container.removeEventListener("scroll", handleScroll);
    };
  }, []);

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
        <GenericList
          filterBy={"name"}
          filterKey={search}
          websocketUrl={"apiWS/games"} //WEBSOCKET PARA CONECTAR CON EL BACKEND
          //websocketUrl={"ws://localhost:1234"} //WEBSOCKET PARA LOS TESTS
          renderItem={renderItem}
          typeKey={"CreatedGames"}
          idKey={"unique_id"}
        />
      </div>
      {isAtBottom && <div>No Hay Más Partidas</div>}
    </div>
  );
}

export default App;
