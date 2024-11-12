import React, { useState, useEffect, useRef } from "react";
import ListGamesView from "./components/ListGamesView";
import { GenericList } from "../GenericList/GenericList";
import { renderItem } from "./components/renderItem";
import { UsernameProvider } from "../../contexts/UsernameContext";
import "./ListGames.css";

function ListGames({ websocketUrl }) {
  const [search, setSearch] = useState("");
  const containerRef = useRef(null);
  const [isAtBottom, setIsAtBottom] = useState(false);
  const [numPlayers, setNumPlayers] = useState(null);

  const handleScroll = () => {
    const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
    setIsAtBottom(scrollTop + clientHeight >= scrollHeight);
  };

  useEffect(() => {
    const container = containerRef.current;
    container.addEventListener("scroll", handleScroll);

    return () => {
      container.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div className="listGamesContainer">
      <UsernameProvider>
        <ListGamesView
          setSearch={setSearch}
          containerRef={containerRef}
          isAtBottom={isAtBottom}
          numPlayers={numPlayers}
          setNumPlayers={setNumPlayers}
        >
          <GenericList
            filterBy={"name"}
            filterKey={search}
            websocketUrl={websocketUrl}
            renderItem={renderItem}
            typeKey={"CreatedGames"}
            idKey={"unique_id"}
            numPlayers={numPlayers}
          />
        </ListGamesView>
      </UsernameProvider>
    </div>
  );
}

export default ListGames;
