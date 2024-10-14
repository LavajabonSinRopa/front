import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import GameLobbyContainer from "../containers/GameLobbyContainer/GameLobbyContainer";
import { UserIdContext } from "../contexts/UserIdContext";
import WS from "jest-websocket-mock";
import { useParams } from "react-router-dom";

// Mockear useParams
jest.mock("react-router-dom", () => {
  return {
    ...jest.requireActual("react-router-dom"), 
    useParams: jest.fn(), 
  };
});

describe("GameLobbyContainer", () => {
  let server;
  const mockUserId = "1";
  const mockGameId = "12345";

  beforeEach(() => {
    // Mockear useParams para devolver game_id
    useParams.mockReturnValue({ game_id: mockGameId });
    server = new WS("ws://localhost:1234", { jsonProtocol: true });
    jest.spyOn(console, "log").mockImplementation(() => {}); // Mockear console.log
    
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
    jest.spyOn(global, "WebSocket").mockImplementation(() => ({
      onopen: jest.fn(),
      onmessage: jest.fn(),
      onerror: jest.fn(),
      onclose: jest.fn(),
      close: jest.fn(),
    }));
  });

  afterEach(() => {
    WS.clean();
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

});
