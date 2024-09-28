function GameInfo({gameName, gameType}) {
  return (
    <div>
      <p><strong>Nombre de la partida:</strong> {gameName}</p>
      <p><strong>Tipo de la partida:</strong> {gameType}</p>
    </div>
  );
};
export default GameInfo;
