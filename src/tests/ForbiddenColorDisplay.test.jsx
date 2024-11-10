// ForbiddenColorDisplay.test.jsx
import React from "react";
import { render, screen } from "@testing-library/react";
import ForbiddenColorDisplay from "../containers/ForbiddenColorDisplay/ForbiddenColorDisplay.jsx";
import ForbiddenColorDisplayView from "../containers/ForbiddenColorDisplay/components/ForbiddenColorDisplayView.jsx";
import '@testing-library/jest-dom';

// Mock de ForbiddenColorDisplayView
jest.mock("../containers/ForbiddenColorDisplay/components/ForbiddenColorDisplayView.jsx", () => ({ text, color }) => (
    <div data-testid="forbidden-color-view" style={{ color }}>
        {text}
    </div>
));

describe("ForbiddenColorDisplay", () => {
    test("muestra el mensaje correcto cuando el color es rojo", () => {
        render(<ForbiddenColorDisplay color="red" />);
        const forbiddenColorView = screen.getByTestId("forbidden-color-view");

        expect(forbiddenColorView).toHaveTextContent("Rojo");
        expect(forbiddenColorView).toHaveStyle({ color: "red" });
    });

    test("muestra el mensaje correcto cuando el color es verde", () => {
        render(<ForbiddenColorDisplay color="green" />);
        const forbiddenColorView = screen.getByTestId("forbidden-color-view");

        expect(forbiddenColorView).toHaveTextContent("Verde");
        expect(forbiddenColorView).toHaveStyle({ color: "green" });
    });

    test("muestra el mensaje correcto cuando el color es azul", () => {
        render(<ForbiddenColorDisplay color="blue" />);
        const forbiddenColorView = screen.getByTestId("forbidden-color-view");

        expect(forbiddenColorView).toHaveTextContent("Azul");
        expect(forbiddenColorView).toHaveStyle({ color: "blue" });
    });

    test("muestra 'Ninguno' cuando el color no está especificado", () => {
        render(<ForbiddenColorDisplay color="purple" />);
        const forbiddenColorView = screen.getByTestId("forbidden-color-view");

        expect(forbiddenColorView).toHaveTextContent("Ninguno");
        expect(forbiddenColorView).toHaveStyle({ color: "purple" });
    });
});
