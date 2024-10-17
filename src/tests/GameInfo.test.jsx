import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import GameInfo from '../containers/GameInfo/GameInfo.jsx';

describe('GameInfo', () => {
  const playersMock = [
    { unique_id: '1', name: 'Sofia' },
    { unique_id: '2', name: 'Pedro' },
    { unique_id: '3', name: 'Martin' },
  ];

  it('muestra numero de turno inicial correctamente', () => {
    render(<GameInfo turnNumber={1} players={playersMock} currentPlayerId="1" userId="1" />);
    expect(screen.getByText('Turno: 1')).toBeInTheDocument();
  });

  it('usuario actual en negrita', () => {
    render(<GameInfo turnNumber={1} players={playersMock} currentPlayerId="1" userId="1" />);
    expect(screen.getByText('Sofia')).toHaveStyle('font-weight: bold');
    expect(screen.getByText('Pedro')).toHaveStyle('font-weight: normal');
    expect(screen.getByText('Martin')).toHaveStyle('font-weight: normal');
  });

  it('mostrar nombres separados por bullet', () => {
    render(<GameInfo turnNumber={1} players={playersMock} currentPlayerId="1" userId="1" />);
    expect(screen.getByText('Jugadores en partida:')).toBeInTheDocument();
    expect(screen.getByText('Sofia')).toBeInTheDocument();
    expect(screen.getByText('Pedro')).toBeInTheDocument();
    expect(screen.getByText('Martin')).toBeInTheDocument();

    // Ver que hayan 2 bullets (3 nombres total)
    const bullets = screen.getAllByText('•');
    expect(bullets).toHaveLength(2);
  });

  it('se muestra el turno del jugador actual', () => {
    render(<GameInfo turnNumber={1} players={playersMock} currentPlayerId="1" userId="1" />);
    expect(screen.getByText('Es el turno de Sofia')).toBeInTheDocument();
  });

  it('se muestra "otro jugador" si el jugador actual no existe en la lista de jugadores', () => {
    render(<GameInfo turnNumber={1} players={playersMock} currentPlayerId="999" userId="1" />);
    expect(screen.getByText('Es el turno de otro jugador')).toBeInTheDocument();
  });
});
