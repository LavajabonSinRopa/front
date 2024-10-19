/* Qué voy a testear de este componente
    1. Test que se renderice sin jugadores
    2. Test que se renderice con jugadores
    3. Test que se resalte el owner
*/
import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import PlayerList from "../../containers/GameLobbyContainer/components/PlayerList/PlayerList";

describe('PlayerList', () => {
    test('Renderiza un mensaje cuando no haya jugadores disponibles', () => {
      render(<PlayerList playerList={[]} ownerId={null} />);
      expect(screen.getByText('No hay jugadores disponibles.')).toBeInTheDocument();
    });
  
    test('Renderiza la lista de jugadores', () => {
      const players = [
        ['1', 'player1'],
        ['2', 'player2'],
      ];
      render(<PlayerList playerList={players} ownerId={null} />);
      expect(screen.getByText('player1')).toBeInTheDocument();
      expect(screen.getByText('player2')).toBeInTheDocument();
    });
  
    test('Resalta en negrita el nombre del owner', () => {
      const players = [
        ['1', 'player1'],
        ['2', 'player2'],
      ];
      render(<PlayerList playerList={players} ownerId='1' />);
      const owner = screen.getByText('player1');
      expect(owner).toHaveStyle('font-weight: bold');
    });
  });