import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import Board from "../containers/Board/Board.jsx";
import { BrowserRouter as Router } from "react-router-dom";

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useParams: jest.fn(),
}));

describe("Board", () => {
  const mockGameId = "1";

  beforeEach(() => {
    require("react-router-dom").useParams.mockReturnValue({
      game_id: mockGameId,
    });

    // Mockear la respuesta de fetch
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true, // Simulamos que la respuesta fue exitosa
        json: () =>
          Promise.resolve({
            board: [
              ["red", "red", "red", "yellow", "yellow", "blue"],
              ["green", "green", "blue", "yellow", "red", "blue"],
              ["blue", "green", "green", "blue", "green", "yellow"],
              ["red", "red", "green", "yellow", "blue", "red"],
              ["yellow", "red", "yellow", "yellow", "yellow", "green"],
              ["blue", "red", "blue", "green", "blue", "green"],
            ],
          }),
      })
    );
  });

  afterEach(() => {
    // Limpiar el mock
    jest.resetAllMocks();
  });

  it("El componente se renderiza correctamente sin errores inicialmente", async () => {
    render(
      <Router>
        <Board />
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

    expect(global.fetch).toHaveBeenCalledWith(`/api/games/${mockGameId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
  });

  it("Si el fetch no se puede realizar se muestra un mensaje de error", async () => {
    fetch.mockImplementationOnce(() =>
      Promise.resolve({
        ok: false,
      })
    );

    render(<Board />);

    const pieces = screen.queryAllByRole("button");
    expect(pieces).toHaveLength(0);    

    expect(screen.getByText("ERROR: FORMATO DE TABLERO INCORRECTO")).toBeInTheDocument();
  });
});
