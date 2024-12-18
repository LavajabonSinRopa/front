import React from "react";
import { render, screen, waitFor, act } from "@testing-library/react";
import "@testing-library/jest-dom";
import GameLobbyContainer from "../../containers/GameLobbyContainer/GameLobbyContainer";
import { UserIdContext } from "../../contexts/UserIdContext";
import { MemoryRouter, useNavigate, useParams } from "react-router-dom";

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useParams: jest.fn(),
  useNavigate: jest.fn()
}));

describe("GameLobbyContainer", () => {
  const mockUserId = "1";
  const mockGameId = "12345";
  let mockWebSocket;
  const navigate = jest.fn(); 

  beforeEach(() => {
    useParams.mockReturnValue({ game_id: mockGameId });
    useNavigate.mockReturnValue(navigate); 
    jest.spyOn(console, "log").mockImplementation(() => {});
    jest.spyOn(console, "error").mockImplementation(() => {});
    
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({
            name: "Test Game",
            unique_id: "12345",
            state: "waiting",
            creator: "player",
            player_names: ["player1", "player2"],
            players: ["1", "2"],
          }),
      })
    );

    mockWebSocket = {
      send: jest.fn(),
      close: jest.fn(),
      onopen: null,
      onmessage: null,
      onerror: null,
      onclose: null,
    };

    global.WebSocket = jest.fn(() => mockWebSocket);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("se debe renderizar mensaje de 'Loading...'", () => {
    render(
      <MemoryRouter>
        <UserIdContext.Provider value={{ userId: mockUserId }}>
          <GameLobbyContainer />
        </UserIdContext.Provider>
      </MemoryRouter>
    );
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("fetchear y mostrar data de partida", async () => {
    render(
      <MemoryRouter>
        <UserIdContext.Provider value={{ userId: mockUserId }}>
          <GameLobbyContainer />
        </UserIdContext.Provider>
      </MemoryRouter>
    );

    // Ver que se haya llamado el fetch mockeado
    expect(global.fetch).toHaveBeenCalledWith("/api/games/12345", expect.any(Object));

    // Esperar que carguen los datos
    await waitFor(() => expect(screen.getByText("Test Game")).toBeInTheDocument());
    expect(screen.getByText("player1")).toBeInTheDocument();
    expect(screen.getByText("player2")).toBeInTheDocument();
  });

  it("maneja errores al crear partida", async () => {
    // Mockear fetch con error
    global.fetch.mockImplementationOnce(() =>
      Promise.resolve({
        ok: false,
        status: 500,
        json: () => Promise.resolve({ message: "Error al crear la partida" }),
      })
    );

    render(
      <MemoryRouter>
        <UserIdContext.Provider value={{ userId: mockUserId }}>
          <GameLobbyContainer />
        </UserIdContext.Provider>
      </MemoryRouter>
    );

    // Esperar mensaje de error en la consola
    await waitFor(() => expect(console.log).toHaveBeenCalledWith("Hubo un problema al crear la partida, intenta de nuevo."));
  });

  it("game_id no provisto", async () => {
    useParams.mockReturnValue({ game_id: undefined });
    render(
      <MemoryRouter>
        <UserIdContext.Provider value={{ userId: mockUserId }}>
          <GameLobbyContainer />
        </UserIdContext.Provider>
      </MemoryRouter>
    );
    await waitFor(() => {
      expect(global.fetch).not.toHaveBeenCalled();
    });
  });

  it("se registra error cuando falla el fetch", async () => {
    // Mockear fetch
    const mockError = new Error("Fetch failed");
    global.fetch = jest.fn().mockRejectedValue(mockError);

    render(
      <MemoryRouter>
        <UserIdContext.Provider value={{ userId: mockUserId }}>
          <GameLobbyContainer />
        </UserIdContext.Provider>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(console.error).toHaveBeenCalledWith("Error:", mockError);
    });
  });

  it("se manejan WS entrantes", async () => {
    render(
      <MemoryRouter>
        <UserIdContext.Provider value={{ userId: mockUserId }}>
          <GameLobbyContainer />
        </UserIdContext.Provider>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(global.WebSocket).toHaveBeenCalledWith(`/apiWS/games/${mockGameId}/${mockUserId}`);
    });

    const mockMessage = {
      type: "PlayerJoined",
      payload: { player_id: "3", player_name: "player3" }
    };

    act(() => {
      mockWebSocket.onmessage({ data: JSON.stringify(mockMessage) });
    });

    await waitFor(() => {
      expect(screen.getByText("player3")).toBeInTheDocument();
    });
  });

  it("se manejan errores WS", async () => {
    render(
      <MemoryRouter>
        <UserIdContext.Provider value={{ userId: mockUserId }}>
          <GameLobbyContainer />
        </UserIdContext.Provider>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(global.WebSocket).toHaveBeenCalled();
    });

    const mockError = new Error("WebSocket error");

    act(() => {
      mockWebSocket.onerror(mockError);
    });

    await waitFor(() => {
      expect(console.error).toHaveBeenCalledWith("WebSocket error observed:", mockError);
    });
  });

  it("cierra conexión", async () => {
    const { unmount } = render(
      <MemoryRouter>
        <UserIdContext.Provider value={{ userId: mockUserId }}>
          <GameLobbyContainer />
        </UserIdContext.Provider>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(global.WebSocket).toHaveBeenCalled();
    });

    unmount();

    expect(mockWebSocket.close).toHaveBeenCalled();
  });

  it("se registra en consola al iniciarse WS", async () => {
    render(
      <MemoryRouter>
        <UserIdContext.Provider value={{ userId: mockUserId }}>
          <GameLobbyContainer />
        </UserIdContext.Provider>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(global.WebSocket).toHaveBeenCalledWith(`/apiWS/games/${mockGameId}/${mockUserId}`);
    });

    act(() => {
      mockWebSocket.onopen();
    });

    expect(console.log).toHaveBeenCalledWith("WebSocket connected");
  });

  it("se registra en consola al cerrarse conexión WS", async () => {
    render(
      <MemoryRouter>
        <UserIdContext.Provider value={{ userId: mockUserId }}>
          <GameLobbyContainer />
        </UserIdContext.Provider>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(global.WebSocket).toHaveBeenCalledWith(`/apiWS/games/${mockGameId}/${mockUserId}`);
    });

    act(() => {
      mockWebSocket.onclose();
    });

    expect(console.log).toHaveBeenCalledWith("WebSocket closed, attempting to reconnect...");
  });

  it("maneja mensajes WS distintos a 'PlayerJoined'", async () => {
    render(
      <MemoryRouter>
        <UserIdContext.Provider value={{ userId: mockUserId }}>
          <GameLobbyContainer />
        </UserIdContext.Provider>
      </MemoryRouter>
    );
  
    await waitFor(() => {
      expect(global.WebSocket).toHaveBeenCalledWith(`/apiWS/games/${mockGameId}/${mockUserId}`);
    });
  
    const initialPlayerList = screen.getAllByRole('listitem').length;
  
    const mockMessage = {
      type: "OtroMensaje",
      payload: { some: "datosdatosdatos" }
    };
  
    act(() => {
      mockWebSocket.onmessage({ data: JSON.stringify(mockMessage) });
    });
  
    // Chequear que no cambie la lista de jugadores
    expect(screen.getAllByRole('listitem').length).toBe(initialPlayerList);
  
    expect(console.log).toHaveBeenCalledWith(mockMessage);
  });

  it("se intenta reconectar cuando falla el fetch", async () => {
    // Mockear fetch con 1 error en el 
    global.fetch
      .mockRejectedValueOnce(new Error("Network error"))
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({
          name: "Prueba",
          unique_id: "12345",
          state: "waiting",
          creator: "54321",
          player_names: ["jugador"],
          players: ["1"],
        }),
      });
  
    render(
      <MemoryRouter>
        <UserIdContext.Provider value={{ userId: mockUserId }}>
          <GameLobbyContainer />
        </UserIdContext.Provider>
      </MemoryRouter>
    );
  
    await waitFor(() => expect(console.error).toHaveBeenCalled());
  
    await new Promise((r) => setTimeout(r, 250));
  
    await waitFor(() => expect(screen.getByText("Prueba")).toBeInTheDocument());
  
    expect(global.fetch).toHaveBeenCalledTimes(2);
  });

  it("maneja mensajes WS de tipo 'PlayerLeft'", async () => {
    render(
      <MemoryRouter>
        <UserIdContext.Provider value={{ userId: mockUserId }}>
          <GameLobbyContainer />
        </UserIdContext.Provider>
      </MemoryRouter>
    );
  
    await waitFor(() => {
      expect(global.WebSocket).toHaveBeenCalledWith(`/apiWS/games/${mockGameId}/${mockUserId}`);
    });
  
    // Esperar que carguen los jugadores
    await waitFor(() => expect(screen.getByText("player1")).toBeInTheDocument());
    await waitFor(() => expect(screen.getByText("player2")).toBeInTheDocument());
  
    const mockMessage = {
      type: "PlayerLeft",
      payload: { player_id: "2" }
    };
  
    act(() => {
      mockWebSocket.onmessage({ data: JSON.stringify(mockMessage) });
    });
  
    // Esperar que se actualice la lista de jugadores
    await waitFor(() => {
      expect(screen.queryByText("player2")).not.toBeInTheDocument();
    });
  
    // Ver que player1 sigue en la lista
    expect(screen.getByText("player1")).toBeInTheDocument();
    
    // Ver que se actualizó la lista
    const playerList = screen.getAllByRole('listitem');
    expect(playerList).toHaveLength(1);
  });

  it("se redirige a /start cuando se llega mensaje 'GameStarted' por WS", async () => {
    const { unmount } = render(
      <MemoryRouter>
        <UserIdContext.Provider value={{ userId: mockUserId }}>
          <GameLobbyContainer />
        </UserIdContext.Provider>
      </MemoryRouter>
    );
  
    await waitFor(() => {
      expect(global.WebSocket).toHaveBeenCalledWith(`/apiWS/games/${mockGameId}/${mockUserId}`);
    });
  
    const mockMessage = {
      type: "GameStarted",
      payload: {}
    };
  
    act(() => {
      mockWebSocket.onmessage({ data: JSON.stringify(mockMessage) });
    });
  
    // Verificar path
    expect(navigate).toHaveBeenCalledWith(`/games/${mockGameId}/start`);
  
    unmount();
  });
  
});