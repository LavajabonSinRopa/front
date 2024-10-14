import React from "react";
import { render, screen, fireEvent, act } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import GameLobby from "../../containers/GameLobbyContainer/components/GameLobby";
import { UserIdContext } from "../../contexts/UserIdContext";
import "@testing-library/jest-dom";

// Mock fetch globally
global.fetch = jest.fn(() =>
	Promise.resolve({
		ok: true,
		json: () => Promise.resolve({}),
	})
);

describe("GameLobby", () => {
	const mockUserIdContextValue = {
		userId: "testCreatorId",
		setUserId: jest.fn(),
	};
	const mockGameData = {
		gameName: "Test Game",
		gameId: "testGameId",
		gameState: "waiting",
		gameCreator: "testCreatorId",
	};
	const mockPlayerList = [
		["player1", "Player 1"],
		["player2", "Player 2"],
		["player3", "Player 3"],
		["player4", "Player 4"],
	];

	let mockSocket;

	beforeEach(() => {
		mockSocket = {
			send: jest.fn(),
			close: jest.fn(),
			onopen: jest.fn(),
			onmessage: jest.fn(),
			onerror: jest.fn(),
			onclose: jest.fn(),
		};

		global.WebSocket = jest.fn(() => mockSocket);
	});

	afterEach(() => {
		jest.clearAllMocks();
	});
	/*
	it("renders GameLobby component", () => {
		render(
			<MemoryRouter>
				<UserIdContext.Provider value={mockUserIdContextValue}>
					<GameLobby
						gameData={mockGameData}
						playerList={mockPlayerList}
						playerId="testUserId"
						socket={mockSocket}
					/>
				</UserIdContext.Provider>
			</MemoryRouter>
		);

		expect(screen.getByText("Test Game")).toBeInTheDocument();
		expect(screen.getByText("Player One")).toBeInTheDocument();
		expect(screen.getByText("Player Two")).toBeInTheDocument();
	});

	it("handles WebSocket connection and messages", () => {
		render(
			<MemoryRouter>
				<UserIdContext.Provider value={mockUserIdContextValue}>
					<GameLobby
						gameData={mockGameData}
						playerList={mockPlayerList}
						playerId="testUserId"
						socket={mockSocket}
					/>
				</UserIdContext.Provider>
			</MemoryRouter>
		);

		// Simulate WebSocket open
		mockSocket.onopen();
		expect(mockSocket.onopen).toHaveBeenCalled();

		// Simulate WebSocket message for GameStarted
		const gameStartedMessage = JSON.stringify({
			type: "GameStarted",
			payload: { gameId: "testGameId" },
		});
		act(() => {
			mockSocket.onmessage({ data: gameStartedMessage });
		});
		expect(mockSocket.onmessage).toHaveBeenCalledWith({
			data: gameStartedMessage,
		});

		// Simulate WebSocket error
		const error = new Event("error");
		act(() => {
			mockSocket.onerror(error);
		});
		expect(mockSocket.onerror).toHaveBeenCalledWith(error);

		// Simulate WebSocket close
		const closeEvent = new Event("close");
		act(() => {
			mockSocket.onclose(closeEvent);
		});
		expect(mockSocket.onclose).toHaveBeenCalledWith(closeEvent);
	});
*/

	it("handles start game button click for game creator", async () => {
		// Mock fetch as successful
		global.fetch.mockResolvedValueOnce({
			ok: true,
			json: async () => ({}),
		});

		render(
			<MemoryRouter>
				<UserIdContext.Provider value={mockUserIdContextValue}>
					<GameLobby
						gameData={mockGameData} // Ensure gameState allows button to be enabled
						playerList={mockPlayerList}
						playerId="testCreatorId"
						socket={mockSocket}
					/>
				</UserIdContext.Provider>
			</MemoryRouter>
		);

		const startButton = screen.getByRole("button", { name: "Iniciar Partida" });

		console.log("Start button found:", startButton);

    expect(startButton).not.toBeDisabled();
    
		await act(async () => {
			fireEvent.click(startButton);
		});

		console.log("Button clicked");
		console.log("Fetch calls:", global.fetch.mock.calls);

		// Verify that fetch was called
		expect(global.fetch).toHaveBeenCalledTimes(1);
		expect(global.fetch).toHaveBeenCalledWith(
			`/api/games/testGameId/start`,
			expect.objectContaining({
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ player_id: "testCreatorId" }),
			})
		);

		// Verify that WebSocket sent the message
		expect(mockSocket.send).toHaveBeenCalledWith(
			JSON.stringify({ type: "GameStarted", payload: { gameId: "testGameId" } })
		);
	});

	/*
	it("handles leave game button click for regular player", async () => {
		// Mockear fetch como exitoso
		global.fetch.mockResolvedValueOnce({
			ok: true,
			json: async () => ({}),
		});

		render(
			<MemoryRouter>
				<UserIdContext.Provider value={mockUserIdContextValue}>
					<GameLobby
						gameData={mockGameData}
						playerList={mockPlayerList}
						playerId="testUserId"
						socket={mockSocket}
					/>
				</UserIdContext.Provider>
			</MemoryRouter>
		);

		const leaveButton = screen.getByRole("button", {
			name: "Abandonar Partida",
		});

		await act(async () => {
			fireEvent.click(leaveButton);
		});

		// Verificar que fetch fue llamado
		expect(global.fetch).toHaveBeenCalledTimes(1);
		expect(global.fetch).toHaveBeenCalledWith(
			`/api/games/testGameId/leave`,
			expect.objectContaining({
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ player_id: "testUserId" }),
			})
		);

		// Verificar que WebSocket envió el mensaje
		expect(mockSocket.send).toHaveBeenCalledWith(
			JSON.stringify({
				type: "PlayerLeft",
				payload: { player_id: "testUserId" },
			})
		);
	});*/
});
