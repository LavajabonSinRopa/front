import React, { useState, useEffect, useRef } from "react";
import ListGamesView from "./components/ListGamesView";
import { GenericList } from "../GenericList/GenericList";
import { renderItem } from "./components/renderItem";

function ListGames({sendDataToParent}) {
  const [search, setSearch] = useState("");
  const containerRef = useRef(null);
  const [isAtBottom, setIsAtBottom] = useState(false);

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
      <ListGamesView
        search={search}
        setSearch={setSearch}
        containerRef={containerRef}
        isAtBottom={isAtBottom}
      >
        <GenericList
          sendDataToParent={sendDataToParent}
          filterBy={"name"}
          filterKey={search}
          websocketUrl={"apiWS/games"} // WEBSOCKET PARA CONECTAR CON EL BACKEND
          renderItem={renderItem}
          typeKey={"CreatedGames"}
          idKey={"unique_id"}
        />
      </ListGamesView>
  );
}

export default ListGames;
