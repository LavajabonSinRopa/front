import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import GameLobby from "../../containers/GameLobbyContainer/components/GameLobby.jsx";

const mockGameData = {
	gameName: "Test Game",
	gameId: "12345",
	gameState: "waiting",
	gameCreator: "creator",
};
const mockPlayerList = [
	["1", "player1"],
	["2", "player2"],
	["3", "player3"],
];
const mockPlayerId = "1";
const mockCreatorId = "creator";


describe("GameLobby", () => {
	beforeEach(() => {
		// Limpia los mocks antes de cada prueba
		jest.clearAllMocks();
		jest.spyOn(console, "log").mockImplementation(() => {}); // Mockear console.log
	});

	it("Se renderizan los componentes internos correctamente (jugador no creador)", () => {
		render(
				<GameLobby
					gameData={mockGameData}
					playerList={mockPlayerList}
					playerId={mockPlayerId}
				/>
		);

		expect(screen.getByText("Test Game")).toBeInTheDocument();
		expect(screen.getByText("Pública")).toBeInTheDocument();
		expect(screen.getByText("player1")).toBeInTheDocument();
		expect(screen.getByText("player2")).toBeInTheDocument();
		expect(screen.getByText("player3")).toBeInTheDocument();
		expect(screen.getByText("Abandonar Partida")).toBeInTheDocument();
	});

	it("Se registra en consola al abandonar un juego", () => {
		render(
			<GameLobby
			gameData={mockGameData}
			playerList={mockPlayerList}
			playerId={mockPlayerId}
			/>
		);
	
		fireEvent.click(screen.getByText("Abandonar Partida")); // Click a boton "Abandonar Partida"
	
		expect(console.log).toHaveBeenCalledWith("Abandonar juego para 12345");
	});

	it("Se renderizan los componentes internos correctamente (creador)", () => {
		render(
				<GameLobby
					gameData={mockGameData}
					playerList={mockPlayerList}
					playerId={mockCreatorId}
				/>
		);

		expect(screen.getByText("Test Game")).toBeInTheDocument();
		expect(screen.getByText("Pública")).toBeInTheDocument();
		expect(screen.getByText("player1")).toBeInTheDocument();
		expect(screen.getByText("player2")).toBeInTheDocument();
		expect(screen.getByText("player3")).toBeInTheDocument();
		expect(screen.getByText("Iniciar Partida")).toBeInTheDocument();
		expect(screen.getByText("Cancelar Partida")).toBeInTheDocument();
	});

	it("Se registra en consola al iniciar un juego", () => {
		render(
		  <GameLobby
			gameData={mockGameData}
			playerList={mockPlayerList}
			playerId={mockCreatorId}
		  />
		);
	
		fireEvent.click(screen.getByText("Iniciar Partida")); // Click a boton "Iniciar Partida"
	
		expect(console.log).toHaveBeenCalledWith("Iniciar juego para 12345");
	});
	
	it("Se registra en consola al cancelar un juego", () => {
		render(
			<GameLobby
			gameData={mockGameData}
			playerList={mockPlayerList}
			playerId={mockCreatorId}
			/>
		);

		fireEvent.click(screen.getByText("Cancelar Partida")); // Click a boton "Cancelar Partida"

		expect(console.log).toHaveBeenCalledWith("Cancelar juego para 12345");
	});
});
