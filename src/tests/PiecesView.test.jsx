import React from "react";
import { render } from "@testing-library/react";
import "@testing-library/jest-dom";
import PiecesView from "../containers/Board/componets/PiecesView";

describe("Componente PiecesView", () => {
  it("aplica la clase del color correctamente", () => {
    const { getByRole } = render(<PiecesView color="red" />);
    const button = getByRole("button");
    expect(button).toHaveClass("red");
  });

  it("agrega la clase isSelected cuando la ficha está seleccionada", () => {
    const { getByRole } = render(<PiecesView color="blue" isSelected />);
    const button = getByRole("button");
    expect(button).toHaveClass("isSelected");
  });
/*
  it("agrega la clase isSwapped cuando la ficha está intercambiada", () => {
    const { getByRole } = render(<PiecesView color="green" isSwapped />);
    const button = getByRole("button");
    expect(button).toHaveClass("isSwapped");
  });
*/
  it("aplica la clase moveableSlot si la ficha se puede mover", () => {
    const { getByRole } = render(<PiecesView color="yellow" moveableSlot />);
    const button = getByRole("button");
    expect(button).toHaveClass("moveableSlot");
  });

  it("aplica la clase movError cuando hay un error en el movimiento", () => {
    const { getByRole } = render(<PiecesView color="black" movError />);
    const button = getByRole("button");
    expect(button).toHaveClass("movError");
  });

  it("resalta como figura formada cuando el color está en mayúsculas", () => {
    const { getByRole } = render(<PiecesView color="BLUE" />);
    const button = getByRole("button");
    expect(button).toHaveClass("isAFormedFigure");
  });

  it("maneja colores con % como movimientos parciales", () => {
    const { getByRole } = render(<PiecesView color="red%" />);
    const button = getByRole("button");
    expect(button).toHaveClass("red");
  });
  it("aplica el color en minúsculas correctamente", () => {
    const { getByRole } = render(<PiecesView color="red" />);
    const button = getByRole("button");
    expect(button).toHaveClass("red");
  });

  it("no aplica ninguna clase de color si el color está vacío", () => {
    const { getByRole } = render(<PiecesView color="" />);
    const button = getByRole("button");
    expect(button).not.toHaveClass("red", "blue", "green");
  });

});
