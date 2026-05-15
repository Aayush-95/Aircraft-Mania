import React from "react";
import { motion } from "framer-motion";
import HomePageButton from "../ui/buttons/WelcomePageButton";

const HomePage = () => {
  return (
    <>
      <div className="mainDiv flex w-full min-h-screen justify-center items-center flex-col gap-6 bg-(--bg-primary)">
        <div className="welcomeText max-w-4xl max-h-fit text-center text-4xl md:text-6xl text-(--text-primary) font-bold leading-tight">
          <motion.h1
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            Welcome to Aircraft Mania!
          </motion.h1>
        </div>
        <motion.div className="exploreBtnDiv gap-3 flex flex-row"
        initial={{opacity:0}}
        animate={{opacity:1}}
        transition={{delay:0.8, duration: 1}}>
          <HomePageButton>
            Explore Aircrafts
          </HomePageButton>
          <HomePageButton>
            About us
          </HomePageButton>
        </motion.div>
      </div>
    </>
  );
};

export default HomePage;
