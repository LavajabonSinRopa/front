function GameInfo({ gameName, gameType }) {
	//console.log("Hola! Soy GameInfo y estoy funcionando");

	return (
		<div>
			<p>
				<strong>Nombre de la partida:</strong> {gameName}
			</p>
			<p>
				<strong>Tipo de la partida:</strong> {gameType}
			</p>
		</div>
	);
}

export default GameInfo;
