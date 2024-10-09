import React, { useState, useEffect, useRef } from "react";
import ListGamesView from "./components/ListGamesView";
import { GenericList } from "../GenericList/GenericList";
import { renderItem } from "./components/renderItem";
import { UsernameProvider } from "../../contexts/UsernameContext";

function ListGames() {
  const [search, setSearch] = useState("");
  const containerRef = useRef(null);
  const [isAtBottom, setIsAtBottom] = useState(false);
  const [newPlayerFlag, setNewPlayerFlag] = useState(false)

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

  const handleNewPlayer = (message, setItems, items) => {
    if (message.type.toLowerCase() === 'newplayer') {
      //Esto el unico efecto que tiene es volver a renderizar genericList
      setNewPlayerFlag(prevFlag => !prevFlag);
    }
  };

  return (
    <UsernameProvider>
      <ListGamesView
        setSearch={setSearch}
        containerRef={containerRef}
        isAtBottom={isAtBottom}
      >
        <GenericList
          filterBy={"name"}
          filterKey={search}
          websocketUrl={"apiWS/games"} // WEBSOCKET PARA CONECTAR CON EL BACKEND
          //websocketUrl={"ws://localhost:1234"} // WEBSOCKET PARA TESTS
          renderItem={renderItem}
          typeKey={"CreatedGames"}
          idKey={"unique_id"}
          onCustomMessage={handleNewPlayer}
        />
      </ListGamesView>
    </UsernameProvider>
  );
}

export default ListGames;
