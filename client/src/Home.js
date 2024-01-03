import React, { useState, useEffect } from "react";
import HeroSection from "./components/HeroSection";
import CRUD_Content from "./components/CRUD_Content";
import CategorySection from "./components/CategorySection";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Home() {
  const navigate = useNavigate();
  axios.defaults.withCredentials = true;
  useEffect(() => {
    axios
      .get("http://localhost:5000/")
      .then((result) => {
        console.log(result);
        if (result.data !== "Success") {
          navigate("/login");
        }
      })
      .catch((err) => console.log(err));
  }, []);
  return (
    <>
      <HeroSection />
      <CRUD_Content />
      <CategorySection />
    </>
  );
}
