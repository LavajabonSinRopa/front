import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import StartGame from "../containers/StartGame/StartGame.jsx";
import WS from "jest-websocket-mock";
import { MemoryRouter, Routes, Route, useNavigate } from "react-router-dom";
import { UserIdProvider } from "../contexts/UserIdContext.jsx";

const message = {
  type: "GameStarted",
  payload: {
    board: [
      ["red", "red", "red", "yellow", "yellow", "blue"],
      ["green", "green", "blue", "yellow", "red", "blue"],
      ["blue", "green", "green", "blue", "green", "yellow"],
      ["red", "red", "green", "yellow", "blue", "red"],
      ["yellow", "red", "yellow", "yellow", "yellow", "green"],
      ["blue", "red", "blue", "green", "blue", "green"],
    ],
    creator: "58cf988c-6813-4aa7-b4af-6009828e2065",
    name: "PartidaDePrueba",
    players: [
      {
        figure_cards: [
          { type: 1, state: "drawn" },
          { type: 2, state: "drawn" },
          { type: 3, state: "drawn" },
        ],
        movement_cards: [
          {
            type: 4,
            unique_id: "618262ac-dd28-4db9-b6cd-a77170ddc20c",
            state: null,
          },
          {
            type: 5,
            unique_id: "52398aeb-fd11-4b9e-b4e7-a5956adc06e1",
            state: null,
          },
          {
            type: 6,
            unique_id: "7726d607-556c-447b-a499-a4f4c4835326",
            state: null,
          },
        ],
        name: "luca",
        unique_id: "58cf988c-6813-4aa7-b4af-6009828e2065",
      },
      {
        figure_cards: [
          { type: 1, state: "drawn" },
          { type: 2, state: "drawn" },
          { type: 3, state: "drawn" },
        ],
        movement_cards: [
          {
            type: 4,
            unique_id: "b4e2a2ff-d1f4-4ec2-a584-9069d09df6f9",
            state: null,
          },
          {
            type: 5,
            unique_id: "450a33e6-4897-4eba-953e-872ceb366c2d",
            state: null,
          },
          {
            type: 6,
            unique_id: "5973e149-d9ab-4d86-9a6d-82cd4f05cb7c",
            state: null,
          },
        ],
        name: "messi",
        unique_id: "5973e149-d9ab-4d86-9a6d-82cd4f05cb7c",
      },
    ],
    state: "started",
    turn: "0",
    unique_id: "93ef1c22-c03e-4b03-9ca6-cbc462676d2f",
  },
};

const wonMessage = {
  type: "GameWon",
  payload: {
    player_id: "58cf988c-6813-4aa7-b4af-6009828e2065",
    player_name: "luca",
  },
};

global.fetch = jest.fn();

const mockedUsedNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockedUsedNavigate,
}));

const mockUserIdContextValue = {
  userId: "12345",
  setUserId: jest.fn(), // Función mockeada
};

describe("CrearPartida", () => {
  let server;

  beforeEach(() => {
    // Crear un servidor WebSocket mock
    server = new WS("ws://localhost:1234/games/gameIdValue/12345", {
      jsonProtocol: true,
    });
  });

  afterEach(() => {
    WS.clean(); // Limpiar los mocks de WebSocket después de cada test
    jest.restoreAllMocks(); // Restaurar los mocks para evitar interferencias con otros tests
  });

  it("El componente se renderiza correctamente sin errores inicialmente", async () => {
    render(
      <MemoryRouter>
        <UserIdProvider value={mockUserIdContextValue}>
          <StartGame
            game_id={"gameIdValue"}
            userId={"12345"}
            websocketUrl={`ws://localhost:1234/games/gameIdValue/12345`}
          />
        </UserIdProvider>
      </MemoryRouter>
    );

    server.send(message);
    // Esperar a que los botones se rendericen
    const pieces = await screen.findAllByRole("button");
    expect(pieces).toHaveLength(37);

    const redPieces = pieces.filter((piece) => piece.className.includes("red"));
    expect(redPieces).toHaveLength(9);

    const greenPieces = pieces.filter((piece) =>
      piece.className.includes("green")
    );
    expect(greenPieces).toHaveLength(9);

    const bluePieces = pieces.filter((piece) =>
      piece.className.includes("blue")
    );
    expect(bluePieces).toHaveLength(9);

    const yellowPieces = pieces.filter((piece) =>
      piece.className.includes("yellow")
    );
    expect(yellowPieces).toHaveLength(9);
    // Verificar si las imágenes se renderizan correctamente
    const images = screen.queryAllByRole("img");
    expect(images).toHaveLength(12); // Cambia esto si esperas imágenes más tarde
  });

  it("Al abandonar partida te manda al lobby", async () => {
    // Mock de la respuesta de la API
    fetch.mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({ message: "Partida creada correctamente" }),
      })
    );

    render(
      <MemoryRouter>
        <UserIdProvider value={mockUserIdContextValue}>
          <StartGame
            game_id={"gameIdValue"}
            userId={"5973e149-d9ab-4d86-9a6d-82cd4f05cb7c"}
            websocketUrl={`ws://localhost:1234/games/gameIdValue/5973e149-d9ab-4d86-9a6d-82cd4f05cb7c`}
          />
        </UserIdProvider>
      </MemoryRouter>
    );

    server.send(message);
    await waitFor(() => {
      const leaveButton = screen.getByText("Abandonar");
      fireEvent.click(leaveButton);
    });

    expect(fetch).toHaveBeenCalledWith(`/api/games/gameIdValue/leave`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        player_id: "5973e149-d9ab-4d86-9a6d-82cd4f05cb7c",
      }),
    });

    const images = screen.queryAllByRole("img");
    expect(images).toHaveLength(0); // Cambia esto si esperas imágenes más tarde

    expect(mockedUsedNavigate).toHaveBeenCalledWith("/");
  });

  it("Cuando alguien abandona no se renderizan mas sus cartas", async () => {
    render(
      <MemoryRouter>
        <UserIdProvider value={mockUserIdContextValue}>
          <StartGame
            game_id={"gameIdValue"}
            userId={"12345"}
            websocketUrl={`ws://localhost:1234/games/gameIdValue/12345`}
          />
        </UserIdProvider>
      </MemoryRouter>
    );

    const leaveMessage = {
      type: "PlayerLeft",
      payload: {
        player_id: "5973e149-d9ab-4d86-9a6d-82cd4f05cb7c",
        player_name: "messi",
      },
    };

    server.send(message);
    server.send(leaveMessage);

    const images = screen.queryAllByRole("img");
    expect(images).toHaveLength(6); // Cambia esto si esperas imágenes más tarde
  });

  it("Al ganar la partida te muestra el mensaje correspondiente", async () => {
    render(
      <MemoryRouter>
        <UserIdProvider value={mockUserIdContextValue}>
          <StartGame
            game_id={"gameIdValue"}
            userId={"58cf988c-6813-4aa7-b4af-6009828e2065"}
            websocketUrl={`ws://localhost:1234/games/gameIdValue/12345`}
          />
        </UserIdProvider>
      </MemoryRouter>
    );

    server.send(message);
    server.send(wonMessage);

    expect(screen.getByText(/¡luca ha ganado!/i)).toBeInTheDocument();
  });
});
