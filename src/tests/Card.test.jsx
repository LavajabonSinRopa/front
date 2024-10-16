import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import Card from "../containers/Cards/Card.jsx";

const figCards = [
  { type: 0, state: "drawn" },
  { type: 1, state: "drawn" },
  { type: 2, state: "drawn" },
];
const movCards = [0, 2, 4];

describe("Card", () => {
  it("El componente se renderiza correctamente sin errores inicialmente", async () => {
    render(
      <Card
        className="cardContainer"
        movCards={movCards}
        showMovCards={true}
        figCards={figCards}
        showFigCards={true}
      />
    );
    const images = screen.getAllByRole("img");
    expect(images).toHaveLength(6); // Verifica que haya 2 imágenes de movimiento
    console.log(images)
    const movImages = images.filter((image) =>
      image.getAttribute("src").includes("mov")
    );    

    const figImages = images.filter((image) =>
      image.getAttribute("src").includes("fig")
    );    

    // Comprobar que son distintas
    expect(movImages[0]).toHaveAttribute("src", "mov1.svg");
    expect(movImages[1]).toHaveAttribute("src", "mov3.svg");
    expect(movImages[2]).toHaveAttribute("src", "mov5.svg");
    expect(figImages[0]).toHaveAttribute("src", "fig01.svg");
    expect(figImages[1]).toHaveAttribute("src", "fig02.svg");
    expect(figImages[2]).toHaveAttribute("src", "fige03.svg");
  });
});
