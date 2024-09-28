import { GenericList } from "../GenericList/GenericList";
import PlayerItem from "./PlayerItem";

function PlayerList() {
  const renderPlayer = (Player) => {
    return <PlayerItem key={player.id} player={player} />;
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
