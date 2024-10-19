import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import Board from "../containers/Board/Board.jsx";
import { BrowserRouter as Router } from "react-router-dom";

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useParams: jest.fn(),
}));


describe("Board", () => {
  const mockGameId = "1";

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
        <Board board={boardMock} />
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
    const boardMock = []
    
    render(<Board board={boardMock} />);

    const pieces = screen.queryAllByRole("button");
    expect(pieces).toHaveLength(0);

    expect(
      screen.getByText("ERROR: FORMATO DE TABLERO INCORRECTO")
    ).toBeInTheDocument();
  });
});
