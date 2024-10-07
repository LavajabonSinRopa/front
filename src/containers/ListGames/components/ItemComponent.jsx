import React, { useContext } from "react";
import { UsernameContext } from "../../../contexts/UsernameContext";

const ItemComponent = ({ item, handleClick }) => {
  const { username, validUsername, handleChangeUser } = useContext(UsernameContext);

  return (
    <div
      key={item.unique_id}
      style={{
        padding: 10,
        margin: 10,
        backgroundColor: "#00061a",
        borderRadius: "30px",
      }}
    >
      <h1>{item.name}</h1>
      <div
        style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}
      >
        <div>
          <h2>{"Cantidad de Jugadores: " + item.players.length + "/4"}</h2>
          <p>{"Estado: " + item.state}</p>
          <p>{"Dueño: " + item.creator}</p>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <button
            onClick={handleClick}
            style={{
              color: "white",
              backgroundColor: validUsername && item.state !== "started" ? "#0059b3" : "red",
              cursor: validUsername && item.state !== "started" ? "pointer" : "not-allowed",
            }}
            disabled={!validUsername || item.state === "started"}
          >
            UNIRSE
          </button>
        </div>
      </div>
    </div>
  );
};

export default ItemComponent;
