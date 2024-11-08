import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import ItemComponent from "./ItemComponent.jsx";
import { UsernameContext } from "../../../contexts/UsernameContext.jsx";
import { UserIdContext } from "../../../contexts/UserIdContext.jsx";

const ItemContainer = ({ item }) => {
  const { username, validUsername, handleChangeUser } =
    useContext(UsernameContext);
  const { userId, setUserId } = useContext(UserIdContext);

  const navigate = useNavigate();

  const handleClick = async (password) => {
    if (validUsername) {
      const gameId = item.unique_id;
      const data = {
        player_name: username,
        password: password || "",
      };
      try {
        const response = await fetch(`/api/games/${gameId}/join`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });

        if (!response.ok) {
          const errorDetails = await response.json();
          throw new Error(errorDetails.detail || "Failed to join the game");
        }

        const result = await response.json();
        setUserId(result.player_id);
        navigate(`/games/${gameId}`);
      } catch (error) {
        throw error;
      }
    }
  };

  return <ItemComponent item={item} handleClick={handleClick} />;
};

export const renderItem = (item) => {
  return <ItemContainer item={item} />;
};
