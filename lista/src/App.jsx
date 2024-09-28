import React, { useState, useEffect, useRef } from "react";
import "./App.css";
import { GenericList } from "./GenericList";

// Ejemplo de render para GenericList
const renderItem = (item) => (
  <div key={item.unique_id} style={{ padding: 10, margin: 10, backgroundColor: '#00061a', borderRadius: '30px' }}>
      <h1>{item.name}</h1>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          <div>
              <h2>{"Cantidad de Jugadores: " + item.players.length + "/4"}</h2>
              <p>{"Estado: " + item.state}</p>
              <p>{"Dueño: " + item.creator}</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <button style={{backgroundColor: '#001866' }}>
                UNIRSE</button>
          </div>
      </div>
  </div>
);


function App() {
  const [search, setSearch] = useState("");
  const [numGames, setNumGames] = useState(3);
  
  /*
  const addGame = () => {
    setNumGames(prevNum => prevNum + 3);
  };
  const containerRef = useRef(null);
  const [isAtBottom, setIsAtBottom] = useState(false);

  const handleScroll = () => {
    const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
    if (scrollTop + clientHeight >= scrollHeight) {
      setIsAtBottom(true);
      addGame();
    } else {
      setIsAtBottom(false);
    }
  };

  useEffect(() => {
    const container = containerRef.current;
    container.addEventListener('scroll', handleScroll);

    return () => {
      container.removeEventListener('scroll', handleScroll);
    };
  }, []);
  */


  return (
    <div >
      <h1>Partidas disponibles</h1>
      <input placeholder="Ingresa un Nombre" onChange={(e) => {setSearch(e.target.value); console.log(search)}} />
      <button>Buscar</button>
      <div /*ref={containerRef} style={{height: '500px', overflowY: 'auto', padding: '10px' }}*/>
      <GenericList
          filterBy={"name"}
          filterKey={search}
          websocketUrl={"/apiWS/games"}
          renderItem={renderItem}
          typeKey={"CreatedGames"}
          idKey={"id"}
        />
      </div>
      {/*isAtBottom && <div>Has llegado al final!</div>*/}
    </div>
  );
}

export default App;
