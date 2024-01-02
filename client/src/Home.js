import React, { useState } from "react";
import HeroSection from "./components/HeroSection";
import CRUD_Content from "./components/CRUD_Content";
import CategorySection from "./components/CategorySection";

export default function Home() {
  return (
    <>
      <HeroSection />
      <CRUD_Content />
      <CategorySection />
    </>
  );
}
