import React from "react";
import { motion } from "framer-motion";
import HomePageButton from "../ui/buttons/WelcomePageButton";
import Navbar from "../components/Navbar";
import MainPanel from "../components/MainPanel";
import AircraftsPage from "./AircraftsPage";

const HomePage = () => {
  return (
    <>
      <Navbar />
      <MainPanel>
        <AircraftsPage />
      </MainPanel>
    </>
  );
};

export default HomePage;
