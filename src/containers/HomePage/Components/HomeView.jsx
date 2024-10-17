import React from "react";

function HomeView({ onNavigate }) {
  return (
    <div style={styles.outerContainer}>
      <div style={styles.innerContainer}>
        <div style={styles.headingContainer}>
          <h1 style={styles.heading}>EL SWITCHER</h1>
        </div>
        <button style={styles.button} onClick={() => onNavigate("/creategame")}>
          Crear Partida
        </button>
        <button style={styles.button} onClick={() => onNavigate("/searchgame")}>
          Buscar Partida
        </button>
      </div>
    </div>
  );
}

const styles = {
  outerContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    width: "100vw",
  },
  innerContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    gap: "20px",
    width: "100%",
  },
  headingContainer: {
    width: "100%",
    backgroundColor: "#9be6c7",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    boxSizing: "border-box",
    opacity: "0.7",
  },
  heading: {
    fontFamily: "SeasideResortNF",
    color: "#497e63",
    fontSize: "70px",
  },
  button: {
    padding: "15px 30px",
    fontSize: "20px",
    cursor: "pointer",
  },
};

export default HomeView;