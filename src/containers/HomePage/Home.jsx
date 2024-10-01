// Home.js
import React from "react";
import { useNavigate } from "react-router-dom";
import HomeView from "./Components/HomeView";

function Home() {
  const navigate = useNavigate();

  const handleNavigate = (path) => {
    navigate(path);
  };

  return <HomeView onNavigate={handleNavigate} />;
}

export default Home;