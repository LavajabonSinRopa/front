import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import ItemComponent from "../containers/ListGames/components/ItemComponent";
import { UsernameContext } from "../contexts/UsernameContext";

const mockHandleClick = jest.fn();

const mockItem = {
  unique_id: "1",
  name: "Test Game",
  player_names: ["Player1", "Player2"],
  players: ["Player1", "Player2"],
  state: "waiting",
  type: "private",
  creator: "Player1",
};

const mockUsernameContextValue = {
  username: "TestUser",
  validUsername: true,
  handleChangeUser: jest.fn(),
};

describe("ItemComponent", () => {
  beforeEach(() => {
    render(
      <UsernameContext.Provider value={mockUsernameContextValue}>
        <ItemComponent item={mockItem} handleClick={mockHandleClick} />
      </UsernameContext.Provider>
    );
  });

  test("renders game name", () => {
    expect(screen.getByText("Test Game")).toBeInTheDocument();
  });

  test("renders player count", () => {
    expect(screen.getByText("Cantidad de Jugadores: 2/4")).toBeInTheDocument();
  });

  test("renders game state", () => {
    expect(screen.getByText("Estado: waiting")).toBeInTheDocument();
  });

  test("renders owner name", () => {
    expect(screen.getByText("Dueño: Player1")).toBeInTheDocument();
  });

  test("does not call handleClick with empty password", async () => {
    const joinButton = screen.getByText("UNIRSE");

    fireEvent.click(joinButton);

    expect(mockHandleClick).not.toHaveBeenCalled();
  });

  test("shows error message when password is incorrect", async () => {
    const passwordInput = screen.getByPlaceholderText("Ingresa una Contraseña");
    const joinButton = screen.getByText("UNIRSE");

    fireEvent.change(passwordInput, { target: { value: "wrongpassword" } });
    fireEvent.click(joinButton);

    await waitFor(() => {
      expect(screen.getByTestId("password-error")).toBeInTheDocument();
    });
  });

  test("calls handleClick with correct password", async () => {
    const passwordInput = screen.getByPlaceholderText("Ingresa una Contraseña");
    const joinButton = screen.getByText("UNIRSE");

    fireEvent.change(passwordInput, { target: { value: "correctpassword" } });
    fireEvent.click(joinButton);

    await waitFor(() => {
      expect(mockHandleClick).toHaveBeenCalledWith("correctpassword");
    });
  });

  test("clears error message when password is deleted", async () => {
    const passwordInput = screen.getByPlaceholderText("Ingresa una Contraseña");
    const joinButton = screen.getByText("UNIRSE");

    fireEvent.change(passwordInput, { target: { value: "wrongpassword" } });
    fireEvent.click(joinButton);

    await waitFor(() => {
      expect(screen.getByTestId("password-error")).toBeInTheDocument();
    });

    fireEvent.change(passwordInput, { target: { value: "" } });

    await waitFor(() => {
      expect(screen.queryByTestId("password-error")).not.toBeInTheDocument();
    });
  });

  test("toggles password visibility", async () => {
    const passwordInput = screen.getByPlaceholderText("Ingresa una Contraseña");
    const toggleButton = screen.getByRole("button", { name: /Mostrar/i });

    // Initially, the password should be hidden
    expect(passwordInput).toHaveAttribute("type", "password");

    // Click the toggle button to show the password
    fireEvent.click(toggleButton);
    expect(passwordInput).toHaveAttribute("type", "text");

    // Click the toggle button again to hide the password
    fireEvent.click(toggleButton);
    expect(passwordInput).toHaveAttribute("type", "password");
  });
});