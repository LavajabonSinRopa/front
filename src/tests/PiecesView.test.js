import React from "react";
import { render, screen } from "@testing-library/react";
import '@testing-library/jest-dom';
import PiecesView from "../containers/Board/components/PiecesView";

describe("PiecesView", () => {
  test("Muestra un botón con el color correcto y la clase isFigure para piezas rojas", () => {
    render(<PiecesView color="red" isFigure />);
    const button = screen.getByRole("button");

    expect(button.classList.contains("button")).toBe(true);
    expect(button.classList.contains("red")).toBe(true);
    expect(button.classList.contains("isFigure")).toBe(true);
  });

  test("Muestra un botón con el color correcto y la clase isFigure para piezas verdes", () => {
    render(<PiecesView color="green" isFigure />);
    const button = screen.getByRole("button");

    expect(button.classList.contains("button")).toBe(true);
    expect(button.classList.contains("green")).toBe(true);
    expect(button.classList.contains("isFigure")).toBe(true);
  });

  test("Muestra un botón con el color correcto y la clase isFigure para piezas azules", () => {
    render(<PiecesView color="blue" isFigure />);
    const button = screen.getByRole("button");

    expect(button.classList.contains("button")).toBe(true);
    expect(button.classList.contains("blue")).toBe(true);
    expect(button.classList.contains("isFigure")).toBe(true);
  });

  test("Muestra un botón con el color correcto y la clase isFigure para piezas amarillas", () => {
    render(<PiecesView color="yellow" isFigure />);
    const button = screen.getByRole("button");

    expect(button.classList.contains("button")).toBe(true);
    expect(button.classList.contains("yellow")).toBe(true);
    expect(button.classList.contains("isFigure")).toBe(true);
  });

  test("Muestra un botón con la clase predeterminada para un color inválido", () => {
    render(<PiecesView color="invalidColor" />);
    const button = screen.getByRole("button");

    expect(button.classList.contains("button")).toBe(true);
    // Asegúrate de que no tenga ninguna de las clases de color específicas
    expect(button.classList.contains("red")).toBe(false);
    expect(button.classList.contains("green")).toBe(false);
    expect(button.classList.contains("blue")).toBe(false);
    expect(button.classList.contains("yellow")).toBe(false);
    expect(button.classList.contains("isFigure")).toBe(false); // Si no aplica para colores inválidos
  });

  test('Asigna la clase correcta para "red" cuando isFigure es false', () => {
    render(<PiecesView color="red" isFigure={false} />);
    const button = screen.getByRole('button');

    expect(button.classList.contains('button')).toBe(true);
    expect(button.classList.contains('red')).toBe(true);
    expect(button.classList.contains('isFigure')).toBe(false);
  });

  test('Asigna la clase correcta para "green" cuando isFigure es false', () => {
    render(<PiecesView color="green" isFigure={false} />);
    const button = screen.getByRole('button');

    expect(button.classList.contains('button')).toBe(true);
    expect(button.classList.contains('green')).toBe(true);
    expect(button.classList.contains('isFigure')).toBe(false);
  });

  test('Asigna la clase correcta para "blue" cuando isFigure es false', () => {
    render(<PiecesView color="blue" isFigure={false} />);
    const button = screen.getByRole('button');

    expect(button.classList.contains('button')).toBe(true);
    expect(button.classList.contains('blue')).toBe(true);
    expect(button.classList.contains('isFigure')).toBe(false);
  });

  test('Asigna la clase correcta para "yellow" cuando isFigure es false', () => {
    render(<PiecesView color="yellow" isFigure={false} />);
    const button = screen.getByRole('button');

    expect(button.classList.contains('button')).toBe(true);
    expect(button.classList.contains('yellow')).toBe(true);
    expect(button.classList.contains('isFigure')).toBe(false);
  });

});
