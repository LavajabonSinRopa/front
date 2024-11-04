import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import Board from "../containers/Board/Board.jsx";
import { BrowserRouter as Router } from "react-router-dom";
import { UserIdProvider } from "../contexts/UserIdContext.jsx";
import { useParams } from "react-router-dom";
import { MovCardProvider } from "../contexts/MovCardContext.jsx";
import { MovementProvider } from "../contexts/MovementContext.jsx";
import { FigCardProvider } from "../contexts/FigCardContext.jsx";

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useParams: jest.fn(),
}));

const mockUserIdContextValue = {
  userId: "12345",
  setUserId: jest.fn(),
};

const mockMovCardContextValue = {
  movCardId: "999999",
  setMovCardId: jest.fn(),
  movCardType: "1",
  setMovCardType: jest.fn(),
};

const mockFigCardContextValue = {
  figCardId: "888888",
  setFigCardId: jest.fn(),
  figCardType: "2",
  setFigCardType: jest.fn(),
};

const mockMovementContextValue = {
  firstPieceXaxis: "0",
  setFirstPieceXaxis: jest.fn(),
  firstPieceYaxis: "0",
  setFirstPieceYaxis: jest.fn(),
  secondPieceXaxis: "1",
  setSecondPieceXaxis: jest.fn(),
  secondPieceYaxis: "1",
  setSecondPieceYaxis: jest.fn(),
};

describe("Board", () => {
  const mockGameId = "1";

  beforeEach(() => {
    useParams.mockReturnValue({ game_id: "GameTestId" });
  });

  afterEach(() => {
    // Limpiar el mock
    jest.resetAllMocks();
  });

  it("El componente se renderiza correctamente sin errores inicialmente", async () => {
    const boardMock = [
      ["red", "red", "red", "yellow", "yellow", "blue"],
      ["green", "green", "blue", "yellow", "red", "blue"],
      ["blue", "green", "green", "blue", "green", "yellow"],
      ["red", "red", "green", "yellow", "blue", "red"],
      ["yellow", "red", "yellow", "yellow", "yellow", "green"],
      ["blue", "red", "blue", "green", "blue", "green"],
    ];

    render(
      <Router>
        <MovementProvider value={mockMovementContextValue}>
          <MovCardProvider value={mockMovCardContextValue}>
            <FigCardProvider value={mockFigCardContextValue}>
              <UserIdProvider value={mockUserIdContextValue}>
                <Board board={boardMock} isYourTurn={true} />
              </UserIdProvider>
            </FigCardProvider>
          </MovCardProvider>
        </MovementProvider>
      </Router>
    );

    // Esperar a que los botones se rendericen
    const pieces = await screen.findAllByRole("button");
    expect(pieces).toHaveLength(36);

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
  });

  it("Si el fetch no se puede realizar se muestra un mensaje de error", async () => {
    const boardMock = [];

    render(
      <Router>
        <MovementProvider value={mockMovementContextValue}>
          <MovCardProvider value={mockMovCardContextValue}>
            <FigCardProvider value={mockFigCardContextValue}>
              <UserIdProvider value={mockUserIdContextValue}>
                <Board board={boardMock} isYourTurn={true} />
              </UserIdProvider>
            </FigCardProvider>
          </MovCardProvider>
        </MovementProvider>
      </Router>
    );

    const pieces = screen.queryAllByRole("button");
    expect(pieces).toHaveLength(0);

    expect(
      screen.getByText("ERROR: FORMATO DE TABLERO INCORRECTO")
    ).toBeInTheDocument();
  });
});
