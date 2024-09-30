// HomeView.js
import React from "react";

function HomeView({ onNavigate }) {
  return (
    <div style={styles.container}>
      <h1>SWITCHER</h1>
      <button style={styles.button} onClick={() => onNavigate("/creategame")}>
        Crear Partida
      </button>
      <button style={styles.button} onClick={() => onNavigate("/searchgame")}>
        Buscar Partida
      </button>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    gap: "20px",
  },
  button: {
    padding: "15px 30px",
    fontSize: "16px",
    cursor: "pointer",
  },
};

export default HomeView;
