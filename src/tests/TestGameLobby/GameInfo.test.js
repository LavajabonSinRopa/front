import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import GameInfo from "../../containers/GameLobbyContainer/components/GameInfo/GameInfo.jsx"

describe("GameInfo", () => {
	it("El componente se renderiza correctamente con gameName y gameType", () => {
		render(
			<GameInfo
				gameName="Partida de prueba"
				gameType="Tipo de prueba"
			/>
		);

		expect(screen.getByText("Nombre de la partida:")).toBeInTheDocument();
		expect(screen.getByText("Partida de prueba")).toBeInTheDocument();

		expect(screen.getByText("Tipo de la partida:")).toBeInTheDocument();
		expect(screen.getByText("Tipo de prueba")).toBeInTheDocument();
	});

	it("El componente renderiza correctamente cuando recibe props vacíos", () => {
		render(
			<GameInfo
				gameName=""
				gameType=""
			/>
		);

		expect(screen.getByText("Nombre de la partida:")).toBeInTheDocument();
		expect(screen.getByText("Tipo de la partida:")).toBeInTheDocument();
	});
});
