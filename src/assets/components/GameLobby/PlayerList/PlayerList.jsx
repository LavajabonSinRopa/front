import React from "react";
import { GenericList } from "../GenericList/GenericList";
import { BASE_WS_ADDRESS } from "../../../utils/constants";

/* Recibe una lista de jugadores y el id del owner de la partida.
   Decide si resaltar el nombre del jugador comparando su id con el del owner.
*/
function PlayerList({ playerList, ownerId }) {

	//console.log("Hola! Soy PlayerList y estoy funcionando");
	const renderPlayer = (player) => {
		return (
			<p style={{ fontWeight: ownerId === player.id ? "bold" : "normal" }}>
				{player.name}
			</p>
		);
	};
	return (
		<>
			<h3>Jugadores</h3>

			<GenericList
				from={0}
				to={4}
				WebSocketUrl={"/games"} //probablemente esté mal, BASE_WS_ADDRESS será??
				renderItem={renderPlayer}
				typekey="CreatedGames"
				idKey="unique_id" //??? no sé qué poner
			/>
			{console.log(playerList)}
		</>
	);
}

export default PlayerList;
