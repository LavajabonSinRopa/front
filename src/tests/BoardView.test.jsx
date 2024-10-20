import React from "react";
import { render, screen } from "@testing-library/react";
import '@testing-library/jest-dom';
import BoardView from "../containers/Board/components/BoardView";


describe("BoardView", () => {
  test("Muestra mensaje de error para formato de tablero inválido", () => {
    const invalidBoard = [
      [1, 2, 3],
      [4, 5],
    ]; 
    render(<BoardView board={invalidBoard} />);
    expect(
      screen.getByText("ERROR: FORMATO DE TABLERO INCORRECTO")
    ).toBeInTheDocument();
  });

  test("Renderiza un tablero correctamente", () => {
    const validBoard = [
      ["w", "b", "w", "b", "w", "b"],
      ["b", "w", "b", "w", "b", "w"],
      ["w", "b", "w", "b", "w", "b"],
      ["b", "w", "b", "w", "b", "w"],
      ["w", "b", "w", "b", "w", "b"],
      ["b", "w", "b", "w", "b", "w"],
    ];
    render(<BoardView board={validBoard} />);
  });
});
