import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import BoardView from "../containers/Board/componets/BoardView";
import { MovementContext } from "../contexts/MovementContext";
import { MovCardContext } from "../contexts/MovCardContext";

// Mocks para los contextos
const movementValue = {
  firstPieceXaxis: 2,
  firstPieceYaxis: 2,
  secondPieceXaxis: null,
  secondPieceYaxis: null,
};

const movCardValue = {
  movCardType: "0",
};

const renderBoardView = (props) => {
  return render(
    <MovementContext.Provider value={movementValue}>
      <MovCardContext.Provider value={movCardValue}>
        <BoardView {...props} />
      </MovCardContext.Provider>
    </MovementContext.Provider>
  );
};

describe("BoardView", () => {
  test("renders without crashing with correct board format", () => {
    const board = [
      ["R", "G", "B", "Y", "R", "G"],
      ["G", "B", "Y", "R", "G", "B"],
      ["B", "Y", "R", "G", "B", "Y"],
      ["Y", "R", "G", "B", "Y", "R"],
      ["R", "G", "B", "Y", "R", "G"],
      ["G", "B", "Y", "R", "G", "B"],
    ];

    renderBoardView({
      board,
      handleMovSelection: jest.fn(),
      swappedPieces: [],
    });

    // Asegúrate de que cada celda está en el documento
    expect(screen.getAllByRole("button").length).toBe(36);
  });

  test("displays error message for incorrect board format", () => {
    const board = [
      ["R", "G", "B"],
      ["G", "B", "Y"],
    ]; // Tablero incorrecto

    renderBoardView({
      board,
      handleMovSelection: jest.fn(),
      swappedPieces: [],
    });

    expect(
      screen.getByText(/ERROR: FORMATO DE TABLERO INCORRECTO/i)
    ).toBeInTheDocument();
  });

  test("calls handleMovSelection when a piece is clicked", () => {
    const board = [
      ["R", "G", "B", "Y", "R", "G"],
      ["G", "B", "Y", "R", "G", "B"],
      ["B", "Y", "R", "G", "B", "Y"],
      ["Y", "R", "G", "B", "Y", "R"],
      ["R", "G", "B", "Y", "R", "G"],
      ["G", "B", "Y", "R", "G", "B"],
    ];

    const handleMovSelection = jest.fn();
    renderBoardView({ board, handleMovSelection, swappedPieces: [] });

    // Simula un click en la celda (0, 0)
    fireEvent.click(screen.getAllByRole("button")[0]);
    expect(handleMovSelection).toHaveBeenCalledWith(0, 0);
  });

  /*
  test("renders PiecesView with isSwapped prop correctly", () => {
    const board = [
      ["R", "G", "B", "Y", "R", "G"],
      ["G", "B", "Y", "R", "G", "B"],
      ["B", "Y", "R", "G", "B", "Y"],
      ["Y", "R", "G", "B", "Y", "R"],
      ["R", "G", "B", "Y", "R", "G"],
      ["G", "B", "Y", "R", "G", "B"],
    ];

    const swappedPieces = [
      [0, 0],
      [1, 1],
    ];

    renderBoardView({ board, handleMovSelection: jest.fn(), swappedPieces });

    const pieces = screen.getAllByRole("button");
    expect(pieces[0]).toHaveClass("button r isAFormedFigure isSwapped");
    expect(pieces[7]).toHaveClass("button b isSwapped");
  });
  */
});
