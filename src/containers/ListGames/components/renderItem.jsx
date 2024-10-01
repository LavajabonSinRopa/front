import React from "react";
import { useNavigate } from "react-router-dom";

const ItemComponent = ({item, sendDataToParent }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    const gameId = item.unique_id; // Asegúrate de usar 'item' en lugar de 'result'
    sendDataToParent(item.creator)
    navigate(`/games/${gameId}`);
  };

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
          <button onClick={handleClick} style={{ backgroundColor: "#001866" }}>
            UNIRSE
          </button>
        </div>
      </div>
    </div>
  );
};

export const renderItem = (sendDataToParent, item) => {
  return <ItemComponent item={item} sendDataToParent={sendDataToParent} />;
};
