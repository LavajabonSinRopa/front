import React from "react";
import { render, screen, fireEvent, act } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import GameLobby from "../../containers/GameLobbyContainer/components/GameLobby";
import { UserIdContext } from "../../contexts/UserIdContext";
import "@testing-library/jest-dom";

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
const mockPlayerId = "player1";

const mockCreatorId = "testCreatorId";

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

  it("Se renderizan los componentes internos correctamente (jugador no creador)", () => {
    render(
      <GameLobby
        gameData={{ ...mockGameData, gameType: "public" }} // Adjusted gameType
        playerList={mockPlayerList}
        playerId={mockPlayerId}
      />
    );
  
    expect(screen.getByText("Test Game")).toBeInTheDocument();
    expect(screen.getByText("Pública")).toBeInTheDocument(); 
    expect(screen.getByText("Player 1")).toBeInTheDocument();
    expect(screen.getByText("Player 2")).toBeInTheDocument();
    expect(screen.getByText("Player 3")).toBeInTheDocument();
    expect(screen.getByText("Player 4")).toBeInTheDocument();
    expect(screen.getByText("Abandonar Partida")).toBeInTheDocument();
  });
  
  it("Se renderizan los componentes internos correctamente (creador)", () => {
    render(
      <GameLobby
        gameData={{ ...mockGameData, gameType: "public" }} // Adjusted gameType
        playerList={mockPlayerList}
        playerId={mockCreatorId}
      />
    );
  
    expect(screen.getByText("Test Game")).toBeInTheDocument();
    expect(screen.getByText("Pública")).toBeInTheDocument(); 
    expect(screen.getByText("Player 1")).toBeInTheDocument();
    expect(screen.getByText("Player 2")).toBeInTheDocument();
    expect(screen.getByText("Player 3")).toBeInTheDocument();
    expect(screen.getByText("Player 4")).toBeInTheDocument();
    expect(screen.getByText("Iniciar Partida")).toBeInTheDocument();
    //expect(screen.getByText("Cancelar Partida")).toBeInTheDocument();
  });

  it("Maneja la conexión y los mensajes de WebSocket", () => {
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

    mockSocket.onopen();
    expect(mockSocket.onopen).toHaveBeenCalled();

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

    const error = new Event("error");
    act(() => {
      mockSocket.onerror(error);
    });
    expect(mockSocket.onerror).toHaveBeenCalledWith(error);

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

  it("Habilita el botón de 'Iniciar Partida' sólo para el owner en un lobby con >= 2 jugadores", async () => {
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
    expect(startButton).not.toBeDisabled();
  });

  it("Deshabilita el botón 'Iniciar Partida' cuando hay < 2 jugadores", () => {
    const lessPlayers = [["player1", "Player 1"]];

    render(
      <MemoryRouter>
        <UserIdContext.Provider value={mockUserIdContextValue}>
          <GameLobby
            gameData={mockGameData}
            playerList={lessPlayers} 
            playerId="testCreatorId" 
          />
        </UserIdContext.Provider>
      </MemoryRouter>
    );

    const startButton = screen.getByText("Iniciar Partida");
    expect(startButton).toBeDisabled(); 
  });

  it("Navega a /start cuando se clickea 'Iniciar Partida'", async () => {
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

  it("Renderiza el botón 'Abandonar Partida' para jugadores que no son el owner", () => {
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

  it("Llama a fetch y navega a home cuando se clickea el botón 'Abandonar Partida", async () => {
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

describe("GameLobby - Console Logs y Errores", () => {
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

  it("registra un mensaje cuando un jugador abandona el juego", async () => {
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

  it("registra un mensaje de error cuando falla al abandonar el juego", async () => {
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

  it("registra un mensaje de error cuando falla el fetch al abandonar el juego", async () => {
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

  it("registra un mensaje de error cuando falla al iniciar la partida", async () => {
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

  it("registra un mensaje de error cuando falla el fetch al iniciar la partida", async () => {
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
