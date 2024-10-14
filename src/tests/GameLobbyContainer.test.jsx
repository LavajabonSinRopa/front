import React from "react";
import { render, screen, waitFor, act } from "@testing-library/react";
import "@testing-library/jest-dom";
import GameLobbyContainer from "../containers/GameLobbyContainer/GameLobbyContainer";
import { UserIdContext } from "../contexts/UserIdContext";
import { useParams } from "react-router-dom";

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useParams: jest.fn(),
}));

describe("GameLobbyContainer", () => {
  const mockUserId = "1";
  const mockGameId = "12345";
  let mockWebSocket;

  beforeEach(() => {
    useParams.mockReturnValue({ game_id: mockGameId });
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
      <UserIdContext.Provider value={{ userId: mockUserId }}>
        <GameLobbyContainer />
      </UserIdContext.Provider>
    );
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("fetchear y mostrar data de partida", async () => {
    render(
      <UserIdContext.Provider value={{ userId: mockUserId }}>
        <GameLobbyContainer />
      </UserIdContext.Provider>
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
      <UserIdContext.Provider value={{ userId: mockUserId }}>
        <GameLobbyContainer />
      </UserIdContext.Provider>
    );

    // Esperar mensaje de error en la consola
    await waitFor(() => expect(console.log).toHaveBeenCalledWith("Hubo un problema al crear la partida, intenta de nuevo."));
  });

  it("game_id no provisto", async () => {
    useParams.mockReturnValue({ game_id: undefined });
    render(
      <UserIdContext.Provider value={{ userId: mockUserId }}>
        <GameLobbyContainer />
      </UserIdContext.Provider>
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
      <UserIdContext.Provider value={{ userId: mockUserId }}>
        <GameLobbyContainer />
      </UserIdContext.Provider>
    );

    await waitFor(() => {
      expect(console.error).toHaveBeenCalledWith("Error:", mockError);
    });

    expect(console.log).toHaveBeenCalledWith("finaly");
  });

  it("se manejan WS entrantes", async () => {
    render(
      <UserIdContext.Provider value={{ userId: mockUserId }}>
        <GameLobbyContainer />
      </UserIdContext.Provider>
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
      <UserIdContext.Provider value={{ userId: mockUserId }}>
        <GameLobbyContainer />
      </UserIdContext.Provider>
    );

    await waitFor(() => {
      expect(global.WebSocket).toHaveBeenCalled();
    });

    const mockError = new Error("WebSocket error");

    act(() => {
      mockWebSocket.onerror(mockError);
    });

    await waitFor(() => {
      expect(console.error).toHaveBeenCalledWith("WebSocket error:", mockError);
    });
  });

  it("cierra conexión", async () => {
    const { unmount } = render(
      <UserIdContext.Provider value={{ userId: mockUserId }}>
        <GameLobbyContainer />
      </UserIdContext.Provider>
    );

    await waitFor(() => {
      expect(global.WebSocket).toHaveBeenCalled();
    });

    unmount();

    expect(mockWebSocket.close).toHaveBeenCalled();
  });

  it("se registra en consola al iniciarse WS", async () => {
    render(
      <UserIdContext.Provider value={{ userId: mockUserId }}>
        <GameLobbyContainer />
      </UserIdContext.Provider>
    );

    await waitFor(() => {
      expect(global.WebSocket).toHaveBeenCalledWith(`/apiWS/games/${mockGameId}/${mockUserId}`);
    });

    act(() => {
      mockWebSocket.onopen();
    });

    expect(console.log).toHaveBeenCalledWith("WebSocket connection established");
  });

  it("se registra en consola al cerrarse conexión WS", async () => {
    render(
      <UserIdContext.Provider value={{ userId: mockUserId }}>
        <GameLobbyContainer />
      </UserIdContext.Provider>
    );

    await waitFor(() => {
      expect(global.WebSocket).toHaveBeenCalledWith(`/apiWS/games/${mockGameId}/${mockUserId}`);
    });

    act(() => {
      mockWebSocket.onclose();
    });

    expect(console.log).toHaveBeenCalledWith("WebSocket de userId connection closed");
  });

  it("maneja mensajes WS distintos a 'PlayerJoined'", async () => {
    render(
      <UserIdContext.Provider value={{ userId: mockUserId }}>
        <GameLobbyContainer />
      </UserIdContext.Provider>
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

});
