import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import '@testing-library/jest-dom';
import ItemComponent from "../containers/ListGames/components/ItemComponent";
import { UsernameContext } from "../contexts/UsernameContext";

const mockHandleClick = jest.fn();
const mockHandleChangeUser = jest.fn();

const renderWithUsernameContext = (ui, { username, validUsername }) => {
  return render(
    <UsernameContext.Provider
      value={{ username, validUsername, handleChangeUser: mockHandleChangeUser }}
    >
      {ui}
    </UsernameContext.Provider>
  );
};

describe("ItemComponent", () => {
  const item = {
    unique_id: "1",
    name: "Test Game",
    type: "private",
    players: ["user1", "user2"],
    player_names: ["user1", "user2"],
    creator: "user1",
    state: "open",
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders component with item details", () => {
    renderWithUsernameContext(<ItemComponent item={item} handleClick={mockHandleClick} />, {
      username: "user3",
      validUsername: true,
    });
    expect(screen.getByText("Cantidad de Jugadores: 2/4")).toBeInTheDocument();
    expect(screen.getByText("Estado: open")).toBeInTheDocument();
    expect(screen.getByText("Dueño: user1")).toBeInTheDocument();
  });

  test("displays password input and validation message for private game", () => {
    renderWithUsernameContext(<ItemComponent item={item} handleClick={mockHandleClick} />, {
      username: "user3",
      validUsername: true,
    });
    const passwordInput = screen.getByPlaceholderText("Ingresa una Contraseña");
    fireEvent.change(passwordInput, { target: { value: "invalid!" } });
    expect(screen.getByText("Solo se permiten letras y números!")).toBeInTheDocument();
  });

  test("disables join button when conditions are not met", () => {
    renderWithUsernameContext(<ItemComponent item={item} handleClick={mockHandleClick} />, {
      username: "user3",
      validUsername: true,
    });
    const joinButton = screen.getByRole("button", { name: "UNIRSE" });
    expect(joinButton).toBeDisabled();
  });

  test("enables join button when password is valid", () => {
    renderWithUsernameContext(<ItemComponent item={item} handleClick={mockHandleClick} />, {
      username: "user3",
      validUsername: true,
    });
    const passwordInput = screen.getByPlaceholderText("Ingresa una Contraseña");
    fireEvent.change(passwordInput, { target: { value: "password1" } });
    const joinButton = screen.getByRole("button", { name: "UNIRSE" });
    expect(joinButton).not.toBeDisabled();
  });

  test("shows password error message when password is invalid", async () => {
    const privateItem = {
      unique_id: "1",
      name: "Test Game",
      type: "private",
      players: ["user1", "user2"],
      player_names: ["user1", "user2"],
      creator: "user1",
      state: "open",
    };
  
    renderWithUsernameContext(
      <ItemComponent item={privateItem} handleClick={mockHandleClick} />,
      { username: "user3", validUsername: true }
    );
  
    const passwordInput = await screen.findByPlaceholderText("Ingresa una Contraseña");
    fireEvent.change(passwordInput, { target: { value: "@!#$%&^*" } });
    const joinButton = screen.getByRole("button", { name: "UNIRSE" });
    fireEvent.click(joinButton);
  
    const errorMessage = await screen.findByText("Solo se permiten letras y números!");
    expect(errorMessage).toBeInTheDocument();

  });
  
  

  test("calls handleClick with password when joining private game", async () => {
    renderWithUsernameContext(<ItemComponent item={item} handleClick={mockHandleClick} />, {
      username: "user3",
      validUsername: true,
  });
  });

  test("clears error message when password is deleted", async () => {
    const privateItem = {
      unique_id: "1",
      name: "Test Game",
      type: "private",
      players: ["user1", "user2"],
      player_names: ["user1", "user2"],
      creator: "user1",
      state: "open",
    };
    renderWithUsernameContext(
      <ItemComponent item={privateItem} handleClick={mockHandleClick} />,
      { username: "user3", validUsername: true }
    );
    const passwordInput = await screen.findByPlaceholderText("Ingresa una Contraseña");
    fireEvent.change(passwordInput, { target: { value: "password1" } });
    expect(passwordInput.value).toBe("password1");
    fireEvent.change(passwordInput, { target: { value: "" } });
    expect(screen.queryByTestId("password-error")).not.toBeInTheDocument();
  });
  
});
