import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import GameLobby from "../../containers/GameLobbyContainer/components/GameLobby.jsx";

const mockGameData = {
	gameName: "Test Game",
	gameId: "12345",
	gameState: "waiting",
	gameCreator: "player",
};
const mockPlayerList = [
	["1", "player1"],
	["2", "player2"],
	["3", "player3"],
];
const mockPlayerId = "1";

describe("GameLobby", () => {
	beforeEach(() => {
		// Limpia los mocks antes de cada prueba
		jest.clearAllMocks();
	});

	it("Se renderizan los componentes internos correctamente", () => {
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
});
