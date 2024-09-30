import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import CrearPartida from "./containers/CrearPartida/CrearPartida";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <div>
        <h1>CREAR PARTIDA</h1>
        <CrearPartida playerName={"Luca"}/>
      </div>
    </>
  );
}

export default App;
