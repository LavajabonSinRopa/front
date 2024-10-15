import React from "react";
import { render, screen, fireEvent, act } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import GameLobby from "../../containers/GameLobbyContainer/components/GameLobby";
import { UserIdContext } from "../../contexts/UserIdContext";
import "@testing-library/jest-dom";

// Mock fetch globally
global.fetch = jest.fn();

const mockedUsedNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
	...jest.requireActual("react-router-dom"),
	useNavigate: () => mockedUsedNavigate,
}));

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

describe("GameLobby", () => {
	const mockUserIdContextValue = {
		userId: "testCreatorId",
		setUserId: jest.fn(),
	};

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

	it("renders GameLobby component", () => {
		render(
			<MemoryRouter>
				<UserIdContext.Provider value={mockUserIdContextValue}>
					<GameLobby
						gameData={mockGameData}
						playerList={mockPlayerList}
						playerId="testUserId"
					/>
				</UserIdContext.Provider>
			</MemoryRouter>
		);

		expect(screen.getByText("Test Game")).toBeInTheDocument();
		expect(screen.getByText("Player 1")).toBeInTheDocument();
		expect(screen.getByText("Player 2")).toBeInTheDocument();
		expect(screen.getByText("Player 3")).toBeInTheDocument();
		expect(screen.getByText("Player 4")).toBeInTheDocument();
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
});

describe("GameLobby - 'Iniciar Partida'", () => {
	const mockUserIdContextValue = {
		userId: "testCreatorId",
		setUserId: jest.fn(),
	};

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

	it("enables 'Iniciar Partida' button only for game creator with 4 players", async () => {
		render(
			<MemoryRouter>
				<UserIdContext.Provider value={mockUserIdContextValue}>
					<GameLobby
						gameData={mockGameData}
						playerList={mockPlayerList}
						playerId="testCreatorId" // The user is the creator
					/>
				</UserIdContext.Provider>
			</MemoryRouter>
		);

		// Verify that the "Iniciar Partida" button is enabled
		const startButton = screen.getByText("Iniciar Partida");
		expect(startButton).not.toBeDisabled(); // Should be enabled because there are 4 players
	});

	it("disables 'Iniciar Partida' button when there are less than 2 players", () => {
		// Mock player list with only 3 players
		const lessPlayers = [
			["player1", "Player 1"]
		];

		render(
			<MemoryRouter>
				<UserIdContext.Provider value={mockUserIdContextValue}>
					<GameLobby
						gameData={mockGameData}
						playerList={lessPlayers} // Less than 4 players
						playerId="testCreatorId" // The user is the creator
					/>
				</UserIdContext.Provider>
			</MemoryRouter>
		);

		// Verify that the "Iniciar Partida" button is disabled
		const startButton = screen.getByText("Iniciar Partida");
		expect(startButton).toBeDisabled(); // Should be disabled because there are less than 4 players
	});

	it("navigates to /start when 'Iniciar Partida' button is clicked", async () => {
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
						playerId="testCreatorId"
						socket={mockSocket}
					/>
				</UserIdContext.Provider>
			</MemoryRouter>
		);

		const startButton = screen.getByText("Iniciar Partida");

		expect(startButton).not.toBeDisabled();

		await act(async () => {
			fireEvent.click(startButton);
		});

		expect(mockedUsedNavigate).toHaveBeenCalledWith(`/games/testGameId/start`);
	});
});

describe("GameLobby - 'Abandonar Partida'", () => {
	const mockUserIdContextValue = {
		userId: "testUserId",
		setUserId: jest.fn(),
	};

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

	it("renders 'Abandonar Partida' button for non-creator players", () => {
		render(
			<MemoryRouter>
				<UserIdContext.Provider value={mockUserIdContextValue}>
					<GameLobby
						gameData={mockGameData}
						playerList={mockPlayerList}
						playerId="testUserId"
					/>
				</UserIdContext.Provider>
			</MemoryRouter>
		);

		const leaveButton = screen.getByText("Abandonar Partida");
		expect(leaveButton).toBeInTheDocument();
	});

	it("calls fetch and navigates to home when 'Abandonar Partida' button is clicked", async () => {
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
					/>
				</UserIdContext.Provider>
			</MemoryRouter>
		);

		const leaveButton = screen.getByText("Abandonar Partida");

		await act(async () => {
			fireEvent.click(leaveButton);
		});

		expect(global.fetch).toHaveBeenCalledTimes(1);
		expect(global.fetch).toHaveBeenCalledWith(
			`/api/games/testGameId/leave`,
			expect.objectContaining({
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ player_id: "testUserId" }),
			})
		);

		expect(mockedUsedNavigate).toHaveBeenCalledWith("/");
	});
});

describe("GameLobby - Console Logs and Errors", () => {
	const mockUserIdContextValue = {
		userId: "testUserId",
		setUserId: jest.fn(),
	};

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

		jest.spyOn(console, "log").mockImplementation(() => {});
		jest.spyOn(console, "error").mockImplementation(() => {});
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	it("logs a message when a player leaves the game", async () => {
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
					/>
				</UserIdContext.Provider>
			</MemoryRouter>
		);

		const leaveButton = screen.getByText("Abandonar Partida");

		await act(async () => {
			fireEvent.click(leaveButton);
		});
	});

	it("logs an error message when failing to leave the game", async () => {
		global.fetch.mockResolvedValueOnce({
			ok: false,
			json: async () => ({}),
		});

		render(
			<MemoryRouter>
				<UserIdContext.Provider value={mockUserIdContextValue}>
					<GameLobby
						gameData={mockGameData}
						playerList={mockPlayerList}
						playerId="testUserId"
					/>
				</UserIdContext.Provider>
			</MemoryRouter>
		);

		const leaveButton = screen.getByText("Abandonar Partida");

		await act(async () => {
			fireEvent.click(leaveButton);
		});

		expect(console.error).toHaveBeenCalledWith(
			"Error al intentar abandonar el lobby"
		);
	});

	it("logs an error message when there is a fetch error while leaving the game", async () => {
		global.fetch.mockRejectedValueOnce(new Error("Network Error"));

		render(
			<MemoryRouter>
				<UserIdContext.Provider value={mockUserIdContextValue}>
					<GameLobby
						gameData={mockGameData}
						playerList={mockPlayerList}
						playerId="testUserId"
					/>
				</UserIdContext.Provider>
			</MemoryRouter>
		);

		const leaveButton = screen.getByText("Abandonar Partida");

		await act(async () => {
			fireEvent.click(leaveButton);
		});

		expect(console.error).toHaveBeenCalledWith(
			"Error en la solicitud:",
			new Error("Network Error")
		);
	});

	it("logs an error message when failing to start the game", async () => {
		global.fetch.mockResolvedValueOnce({
			ok: false,
			json: async () => ({}),
		});

		render(
			<MemoryRouter>
				<UserIdContext.Provider value={mockUserIdContextValue}>
					<GameLobby
						gameData={mockGameData}
						playerList={mockPlayerList}
						playerId="testCreatorId"
					/>
				</UserIdContext.Provider>
			</MemoryRouter>
		);

		const startButton = screen.getByText("Iniciar Partida");

		await act(async () => {
			fireEvent.click(startButton);
		});

		expect(console.error).toHaveBeenCalledWith(
			"Error al intentar iniciar la partida"
		);
	});

	it("logs an error message when there is a fetch error while starting the game", async () => {
		global.fetch.mockRejectedValueOnce(new Error("Network Error"));

		render(
			<MemoryRouter>
				<UserIdContext.Provider value={mockUserIdContextValue}>
					<GameLobby
						gameData={mockGameData}
						playerList={mockPlayerList}
						playerId="testCreatorId"
					/>
				</UserIdContext.Provider>
			</MemoryRouter>
		);

		const startButton = screen.getByText("Iniciar Partida");

		await act(async () => {
			fireEvent.click(startButton);
		});

		expect(console.error).toHaveBeenCalledWith(
			"Error en la solicitud:",
			new Error("Network Error")
		);
	});
});
