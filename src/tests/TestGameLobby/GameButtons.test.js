import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import GameButtons from "../../containers/GameLobbyContainer/components/GameButtons/GameButtons.jsx";

describe("GameButtons", () => {
	const mockOnStartGame = jest.fn();
	const mockOnLeaveGame = jest.fn();

	it("Muestra el botón de 'Iniciar Partida' solo para el owner", () => {
		render(
			<GameButtons
				playerId="ownerId"
				ownerId="ownerId"
				onStartGame={mockOnStartGame}
				onLeaveGame={mockOnLeaveGame}
				playerList={["ownerId", "playerId1", "playerId2", "playerId3"]} // Mock player list with 4 players
			/>
		);

		expect(screen.getByText("Iniciar Partida")).toBeInTheDocument();
	});

	it("No muestra el botón de 'Iniciar Partida' para un jugador que no es el owner", () => {
		render(
			<GameButtons
				playerId="playerId"
				ownerId="ownerId"
				onStartGame={mockOnStartGame}
				onLeaveGame={mockOnLeaveGame}
				playerList={["ownerId", "playerId1", "playerId2", "playerId3"]} // Mock player list with 4 players
			/>
		);

		expect(screen.queryByText("Iniciar Partida")).not.toBeInTheDocument();
		expect(screen.getByText("Abandonar Partida")).toBeInTheDocument();
	});

	it("Llama a 'onStartGame' cuando el owner hace clic en el botón 'Iniciar Partida'", () => {
		render(
			<GameButtons
				playerId="ownerId"
				ownerId="ownerId"
				onStartGame={mockOnStartGame}
				onLeaveGame={mockOnLeaveGame}
				playerList={["ownerId", "playerId1", "playerId2", "playerId3"]} // Mock player list with 4 players
			/>
		);

		fireEvent.click(screen.getByText("Iniciar Partida"));
		expect(mockOnStartGame).toHaveBeenCalledTimes(1);
	});

	// it("Llama a 'onCancelGame' cuando el owner hace clic en el botón 'Cancelar Partida'", () => {
	// 	render(
	// 		<GameButtons
	// 			playerId="ownerId"
	// 			ownerId="ownerId"
	// 			onStartGame={mockOnStartGame}
	// 			//onCancelGame={mockOnCancelGame}
	// 			onLeaveGame={mockOnLeaveGame}
	// 		/>
	// 	);

	// 	fireEvent.click(screen.getByText("Cancelar Partida"));

	// 	expect(mockOnCancelGame).toHaveBeenCalledTimes(1);
	// });

	it("Llama a 'onLeaveGame' cuando un jugador hace clic en el botón 'Abandonar Partida'", () => {
		render(
			<GameButtons
				playerId="playerId"
				ownerId="ownerId"
				onStartGame={mockOnStartGame}
				onLeaveGame={mockOnLeaveGame}
				playerList={["ownerId", "playerId1", "playerId2", "playerId3"]} // Mock player list with 4 players
			/>
		);

		fireEvent.click(screen.getByText("Abandonar Partida"));
		expect(mockOnLeaveGame).toHaveBeenCalledTimes(1);
	});
});