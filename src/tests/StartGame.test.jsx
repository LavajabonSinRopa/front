import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import StartGame from "../containers/StartGame/StartGame.jsx";
import WS from "jest-websocket-mock";
import {
  MemoryRouter,
  Routes,
  Route,
  useNavigate,
  useParams,
} from "react-router-dom";
import { UserIdContext, UserIdProvider } from "../contexts/UserIdContext.jsx";
import {
  MovementContext,
  MovementProvider,
} from "../contexts/MovementContext.jsx";
import {
  MovCardContext,
  MovCardProvider,
} from "../contexts/MovCardContext.jsx";

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
        unique_id: "8825596f-450e-438d-bd17-a2202af15f4a",
        name: "luca",
        movement_cards: [
          {
            type: 1,
            unique_id: "c64f69b3-746a-41b5-93c3-26800a9b864e",
            state: null,
          },
          {
            type: 2,
            unique_id: "ead42368-e902-4b3c-99d1-f7b65b6fe1e3",
            state: null,
          },
          {
            type: 3,
            unique_id: "ef43d251-8dda-4a08-8fda-f1b159a31ec1",
            state: null,
          },
        ],
        figure_cards: [
          { type: 4, state: "drawn" },
          { type: 5, state: "drawn" },
          { type: 6, state: "drawn" },
        ],
      },
      {
        unique_id: "e1ba906d-d1c7-41c3-9495-da40a38f1acc",
        name: "messi",
        movement_cards: [
          {
            type: 4,
            unique_id: "416305b3-df8a-4889-9388-fe1e89dead57",
            state: null,
          },
          {
            type: 5,
            unique_id: "816a767b-2c00-4f4c-bd10-987a45ce8eed",
            state: null,
          },
          {
            type: 6,
            unique_id: "2b219f08-5d29-4e69-8dcf-1ae6d79f10aa",
            state: null,
          },
        ],
        figure_cards: [
          { type: 1, state: "drawn" },
          { type: 2, state: "drawn" },
          { type: 3, state: "drawn" },
        ],
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
    player_id: "8825596f-450e-438d-bd17-a2202af15f4a",
    player_name: "luca",
  },
};

global.fetch = jest.fn();

const mockedUsedNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockedUsedNavigate,
  useParams: () => ({ game_id: "gameIdValue" }), // Mock de useParams devolviendo "gameTestId"
}));

const mockUserIdContextValue = {
  userId: "8825596f-450e-438d-bd17-a2202af15f4a",
  setUserId: jest.fn(),
};

const mockMovCardContextValue = {
  movCardId: "c64f69b3-746a-41b5-93c3-26800a9b864e",
  setMovCardId: jest.fn(),
  movCardType: "1",
  setMovCardType: jest.fn(),
};

const mockMovementContextValue = {
  firstPieceXaxis: 0,
  setFirstPieceXaxis: jest.fn(),
  firstPieceYaxis: 0,
  setFirstPieceYaxis: jest.fn(),
  secondPieceXaxis: 2,
  setSecondPieceXaxis: jest.fn(),
  secondPieceYaxis: 0,
  setSecondPieceYaxis: jest.fn(),
};

describe("CrearPartida", () => {
  let server;

  beforeEach(() => {
    // Crear un servidor WebSocket mock
    server = new WS(
      "ws://localhost:1234/games/gameIdValue/8825596f-450e-438d-bd17-a2202af15f4a",
      {
        jsonProtocol: true,
      }
    );
  });

  afterEach(() => {
    WS.clean(); // Limpiar los mocks de WebSocket después de cada test
    jest.restoreAllMocks(); // Restaurar los mocks para evitar interferencias con otros tests
  });

  it("El componente se renderiza correctamente sin errores inicialmente", async () => {
    render(
      <MemoryRouter>
        <UserIdContext.Provider value={mockUserIdContextValue}>
          <StartGame
            game_id={"gameIdValue"}
            userId={"8825596f-450e-438d-bd17-a2202af15f4a"}
            websocketUrl={`ws://localhost:1234/games/gameIdValue/8825596f-450e-438d-bd17-a2202af15f4a`}
          />
        </UserIdContext.Provider>
      </MemoryRouter>
    );

    server.send(message);
    // Esperar a que los botones se rendericen
    // Cuenta tanto las fichas del tablero como el botón de abandonar y el de saltear turno
    const pieces = await screen.findAllByRole("button");
    expect(pieces).toHaveLength(39);

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
      })
    );

    render(
      <MemoryRouter>
        <MovementContext.Provider value={mockMovementContextValue}>
          <MovCardContext.Provider value={mockMovCardContextValue}>
            <UserIdContext.Provider value={mockUserIdContextValue}>
              <StartGame
                game_id={"gameIdValue"}
                userId={"8825596f-450e-438d-bd17-a2202af15f4a"}
                websocketUrl={`ws://localhost:1234/games/gameIdValue/8825596f-450e-438d-bd17-a2202af15f4a`}
              />
            </UserIdContext.Provider>
          </MovCardContext.Provider>
        </MovementContext.Provider>
      </MemoryRouter>
    );

    server.send(message);

    const leaveButton = await screen.findByText("Abandonar");
    fireEvent.click(leaveButton);

    expect(fetch).toHaveBeenCalledWith(`/api/games/gameIdValue/leave`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        player_id: "8825596f-450e-438d-bd17-a2202af15f4a",
      }),
    });

    await waitFor(() => {
      expect(mockedUsedNavigate).toHaveBeenCalledWith("/");
    });
  });

  it("Cuando alguien abandona no se renderizan mas sus cartas", async () => {
    render(
      <MemoryRouter>
        <UserIdContext.Provider value={mockUserIdContextValue}>
          <StartGame
            game_id={"gameIdValue"}
            userId={"8825596f-450e-438d-bd17-a2202af15f4a"}
            websocketUrl={`ws://localhost:1234/games/gameIdValue/8825596f-450e-438d-bd17-a2202af15f4a`}
          />
        </UserIdContext.Provider>
      </MemoryRouter>
    );

    const leaveMessage = {
      type: "PlayerLeft",
      payload: {
        player_id: "e1ba906d-d1c7-41c3-9495-da40a38f1acc",
        player_name: "messi",
      },
    };

    server.send(message);
    screen.debug();
    server.send(leaveMessage);

    const images = screen.queryAllByRole("img");
    expect(images).toHaveLength(6); // Cambia esto si esperas imágenes más tarde
  });

  it("Al ganar la partida te muestra el mensaje correspondiente", async () => {
    render(
      <MemoryRouter>
        <UserIdContext.Provider value={mockUserIdContextValue}>
          <StartGame
            game_id={"gameIdValue"}
            userId={"8825596f-450e-438d-bd17-a2202af15f4a"}
            websocketUrl={`ws://localhost:1234/games/gameIdValue/8825596f-450e-438d-bd17-a2202af15f4a`}
          />
        </UserIdContext.Provider>
      </MemoryRouter>
    );

    server.send(message);
    server.send(wonMessage);

    expect(screen.getByText(/¡luca ha ganado!/i)).toBeInTheDocument();
  });

  it("Cuando se hace clicks sobre una carta, cambia el estado y animaciones", async () => {
    const { container } = render(
      <MovementContext.Provider value={mockMovementContextValue}>
        <MovCardContext.Provider value={mockMovCardContextValue}>
          <UserIdContext.Provider value={mockUserIdContextValue}>
            <StartGame
              game_id={"gameIdValue"}
              userId={"8825596f-450e-438d-bd17-a2202af15f4a"}
              websocketUrl={`ws://localhost:1234/games/gameIdValue/8825596f-450e-438d-bd17-a2202af15f4a`}
            />
          </UserIdContext.Provider>
        </MovCardContext.Provider>
      </MovementContext.Provider>
    );

    server.send(message);

    const cardElement = container.querySelector(
      '[data-id="c64f69b3-746a-41b5-93c3-26800a9b864e"]'
    );

    expect(cardElement).toHaveStyle("transform: scale(1)");

    fireEvent.click(cardElement);

    await waitFor(() => {
      expect(cardElement).toHaveStyle("transform: scale(1.5)");
    });

    fireEvent.click(cardElement);

    await waitFor(() => {
      expect(cardElement).toHaveStyle("transform: scale(1)");
    });

    fireEvent.click(cardElement);

    const otherCardElement = container.querySelector(
      '[data-id="ead42368-e902-4b3c-99d1-f7b65b6fe1e3"]'
    );

    fireEvent.click(otherCardElement);

    await waitFor(() => {
      expect(cardElement).toHaveStyle("transform: scale(1)");
    });
    await waitFor(() => {
      expect(otherCardElement).toHaveStyle("transform: scale(1.5)");
    });
  });

  it("Cuando se hace clicks sobre una ficha, sin tener una carta seleccionada, solo se selecciona la ficha", async () => {
    const { container } = render(
      <MovementContext.Provider value={mockMovementContextValue}>
        <MovCardContext.Provider value={mockMovCardContextValue}>
          <UserIdContext.Provider value={mockUserIdContextValue}>
            <StartGame
              game_id={"gameIdValue"}
              userId={"8825596f-450e-438d-bd17-a2202af15f4a"}
              websocketUrl={`ws://localhost:1234/games/gameIdValue/8825596f-450e-438d-bd17-a2202af15f4a`}
            />
          </UserIdContext.Provider>
        </MovCardContext.Provider>
      </MovementContext.Provider>
    );

    server.send(message);
    const buttons = screen.getAllByRole("button");
    const firstButton = buttons[0];
    fireEvent.click(firstButton);
  });

  it("Cuando se hace clicks sobre una ficha, con una carta seleccionada, se muestran los movimientos posibles", async () => {
    const { container } = render(
      <MovementContext.Provider value={mockMovementContextValue}>
        <MovCardContext.Provider value={mockMovCardContextValue}>
          <UserIdContext.Provider value={mockUserIdContextValue}>
            <StartGame
              game_id={"gameIdValue"}
              userId={"8825596f-450e-438d-bd17-a2202af15f4a"}
              websocketUrl={`ws://localhost:1234/games/gameIdValue/8825596f-450e-438d-bd17-a2202af15f4a`}
            />
          </UserIdContext.Provider>
        </MovCardContext.Provider>
      </MovementContext.Provider>
    );

    server.send(message);
    const buttons = screen.getAllByRole("button");
    const firstButton = buttons[0];
    fireEvent.click(firstButton);
    await waitFor(() => {
      expect(firstButton).toHaveClass("isSelected");
    });
    const cardElement = container.querySelector(
      '[data-id="c64f69b3-746a-41b5-93c3-26800a9b864e"]'
    );
    expect(cardElement).toHaveStyle("transform: scale(1)");

    fireEvent.click(cardElement);

    await waitFor(() => {
      expect(cardElement).toHaveStyle("transform: scale(1.5)");
    });
    const moveableSlots = container.querySelectorAll(".moveableSlot");

    expect(moveableSlots.length).toBe(2);
    screen.debug();
  });

  it("Cuando se hace clicks sobre 2 fichas, con una carta seleccionada, se realiza el movimiento", async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ message: "Movimiento exitoso" }),
      })
    );

    const { container } = render(
      <MovementContext.Provider value={mockMovementContextValue}>
        <MovCardContext.Provider value={mockMovCardContextValue}>
          <UserIdContext.Provider value={mockUserIdContextValue}>
            <StartGame
              game_id={"gameIdValue"}
              userId={"8825596f-450e-438d-bd17-a2202af15f4a"}
              websocketUrl={`ws://localhost:1234/games/gameIdValue/8825596f-450e-438d-bd17-a2202af15f4a`}
            />
          </UserIdContext.Provider>
        </MovCardContext.Provider>
      </MovementContext.Provider>
    );

    server.send(message);
    const buttons = screen.getAllByRole("button");
    const firstButton = buttons[0];

    fireEvent.click(firstButton);

    await waitFor(() => {
      expect(firstButton).toHaveClass("isSelected");
      expect(firstButton).toHaveClass("red");
    });

    const cardElement = container.querySelector(
      '[data-id="c64f69b3-746a-41b5-93c3-26800a9b864e"]'
    );
    expect(cardElement).toHaveStyle("transform: scale(1)");

    fireEvent.click(cardElement);

    await waitFor(() => {
      expect(cardElement).toHaveStyle("transform: scale(1.5)");
    });

    const moveableSlots = container.querySelectorAll(".moveableSlot");
    expect(moveableSlots.length).toBe(2);
    expect(moveableSlots[1]).toHaveClass("blue");

    fireEvent.click(moveableSlots[1]);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(`/api/games/gameIdValue/move`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          player_id: mockUserIdContextValue.userId,
          from_x: mockMovementContextValue.firstPieceXaxis,
          from_y: mockMovementContextValue.firstPieceYaxis,
          to_x: 0,
          to_y: 2,
          card_id: mockMovCardContextValue.movCardId,
        }),
      });
    });

    // Limpiar mocks
    global.fetch.mockRestore();

    await waitFor(() => {
      expect(cardElement).toHaveStyle("transform: scale(1)");
    });

    const message2 = {
      type: "MovSuccess",
      payload: {
        board: [
          ["blue", "red", "red", "yellow", "yellow", "blue"],
          ["green", "green", "blue", "yellow", "red", "blue"],
          ["red", "green", "green", "blue", "green", "yellow"],
          ["red", "red", "green", "yellow", "blue", "red"],
          ["yellow", "red", "yellow", "yellow", "yellow", "green"],
          ["blue", "red", "blue", "green", "blue", "green"],
        ],
        players: [
          {
            unique_id: "8825596f-450e-438d-bd17-a2202af15f4a",
            name: "luca",
            movement_cards: [
              {
                type: 1,
                unique_id: "c64f69b3-746a-41b5-93c3-26800a9b864e",
                state: null,
              },
              {
                type: 2,
                unique_id: "ead42368-e902-4b3c-99d1-f7b65b6fe1e3",
                state: null,
              },
              {
                type: 3,
                unique_id: "ef43d251-8dda-4a08-8fda-f1b159a31ec1",
                state: null,
              },
            ],
            figure_cards: [
              { type: 4, state: "drawn" },
              { type: 5, state: "drawn" },
              { type: 6, state: "drawn" },
            ],
          },
          {
            unique_id: "e1ba906d-d1c7-41c3-9495-da40a38f1acc",
            name: "messi",
            movement_cards: [
              {
                type: 4,
                unique_id: "416305b3-df8a-4889-9388-fe1e89dead57",
                state: null,
              },
              {
                type: 5,
                unique_id: "816a767b-2c00-4f4c-bd10-987a45ce8eed",
                state: null,
              },
              {
                type: 6,
                unique_id: "2b219f08-5d29-4e69-8dcf-1ae6d79f10aa",
                state: null,
              },
            ],
            figure_cards: [
              { type: 1, state: "drawn" },
              { type: 2, state: "drawn" },
              { type: 3, state: "drawn" },
            ],
          },
        ],
      },
    };

    server.send(message2);

    await waitFor(() => {
      expect(firstButton).toHaveClass("blue");
      expect(moveableSlots[1]).toHaveClass("red");
    });

    const selectedPieces = container.querySelectorAll(".isSelected");
    expect(selectedPieces.length).toBe(0);
  });
});
