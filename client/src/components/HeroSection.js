import React, { useState } from "react";

export default function HeroSection() {
  return (
    <>
      {" "}
      <div className="bg-gradient-to-r from-blue-400 to-indigo-500 text-white min-h-screen flex items-center hero">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl font-bold mb-4">Welcome to My Website</h1>
          <p className="text-lg mb-8">
            Explore our amazing features and services.
          </p>
          <button className="bg-white text-blue-500 px-6 py-3 rounded-full font-semibold hover:bg-blue-100 transition duration-300">
            Get Started
          </button>
        </div>
      </div>
    </>
  );
}
