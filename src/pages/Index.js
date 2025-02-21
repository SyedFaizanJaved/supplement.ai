import React from "react";
import { LandingHero } from "../components/LandingHero";
import { GridBackground } from "../components/backgrounds/GridBackground";
import styles from "./Index.module.css";
import { useNavigate } from "react-router";

const Index = () => {
  const navigate = useNavigate();
  React.useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      navigate("/dashboard");
    }
  }, []);
  return (
    <div className={styles.container}>
      <GridBackground />
      <LandingHero />
    </div>
  );
};

export default Index;
