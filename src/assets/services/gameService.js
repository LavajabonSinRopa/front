import { useEffect } from "react";

function getPlayersList() {
  const [players, setPlayers] = useState(null);

  useEffect(() => {
    fetch("")
      .then((response) => response.json())
      .then((data) => setPlayers(data));
  }, []);
  return <></>;
}
export default getPlayersList;
