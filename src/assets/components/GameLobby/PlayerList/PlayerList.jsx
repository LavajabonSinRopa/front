import React from "react";
import { GenericList } from "../GenericList/GenericList";
import { BASE_WS_ADDRESS } from "../../../utils/constants";

/* Recibe una lista de jugadores y el id del owner de la partida.
   Decide si resaltar el nombre del jugador comparando su id con el del owner.
*/
function PlayerList({ playerList, ownerId }) {
	console.log("Hola! Soy PlayerList y estoy funcionando");

	const renderPlayer = (player) => {
		console.log("Hola! Soy RenderPlayer y estoy funcionando");
		return (
			<p style={{ fontWeight: ownerId === player.id ? "bold" : "normal" }}>
				{player.name}
			</p>
		);
	};
	return (
		<>
			<h2>Jugadores</h2>

			<GenericList
				from={0}
				to={4}
				WebSocketUrl={BASE_WS_ADDRESS}
				renderItem={renderPlayer}
				typekey="CreatedGames"
				idKey="id"
			/>
			{console.log("Hola! Soy el return de PlayerList y estoy funcionando")}
		</>
	);
}

export default PlayerList;
