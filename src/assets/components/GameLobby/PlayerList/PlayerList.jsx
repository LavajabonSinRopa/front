import { GenericList } from "../GenericList/GenericList";
import PlayerItem from "./PlayerItem";

/* Recibe una lista de jugadores y el id del owner de la partida,
le pase ownerId a PlayerItem para que pueda decidir si resalta o no a ese
usuario
*/
function PlayerList({ players, ownerId }) {
  const renderPlayer = (player) => {
    return <PlayerItem playerId={player.id} player={player} ownerId={ownerId} />;
  };

  return (
    <>
      <h2>Jugadores</h2>
      {/* GenericList = ({apiEndpoint, from, to, websocketUrl, renderItem */}
      <GenericList
        apiEndpoint="/api/players"
        from={0}
        to={4}
        WebSocketUrl="/ws/players"
        renderItem={renderPlayer}
      />
    </>
  );
}

export default PlayerList;
