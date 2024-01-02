import React, { useState } from "react";
import { Button } from "@material-tailwind/react";
import { Link } from "react-router-dom";

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };
  return (
    <nav className="fixed start-0 top-0 bg-white bg-opacity-50 backdrop-blur-sm p-4 z-10 w-full shadow-lg">
      <div className="container mx-auto">
        <div className="flex items-center justify-between">
          <div className="text-gray-800 font-bold text-xl">My Website</div>
          <div className="hidden md:flex space-x-4 mr-12">
            <a href="/" className="text-gray-800 hover:text-gray-600 my-auto">
              Home
            </a>
            <a href="#" className="text-gray-800 hover:text-gray-600 my-auto">
              About
            </a>
            <a href="#" className="text-gray-800 hover:text-gray-600 my-auto">
              Services
            </a>
            <a href="#" className="text-gray-800 hover:text-gray-600 my-auto">
              Contact
            </a>
            <Link to="/login">
              <Button color="blue" className="text-white text-sm px-4">
                Login
              </Button>
            </Link>
            <Link to="/register">
              <Button color="blue" className="text-white text-sm px-4">
                Signup
              </Button>
            </Link>
          </div>
          <div className="md:hidden">
            {/* Mobile menu button */}
            <button
              type="button"
              className="text-gray-800 hover:text-gray-600 focus:outline-none"
              onClick={toggleMobileMenu}
            >
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16m-7 6h7"
                ></path>
              </svg>
            </button>
          </div>
        </div>
        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden">
            <a
              href="/"
              className="block py-2 text-gray-800 hover:text-gray-600"
            >
              Home
            </a>
            <a
              href="#"
              className="block py-2 text-gray-800 hover:text-gray-600"
            >
              About
            </a>
            <a
              href="#"
              className="block py-2 text-gray-800 hover:text-gray-600"
            >
              Services
            </a>
            <a
              href="#"
              className="block py-2 text-gray-800 hover:text-gray-600"
            >
              Contact
            </a>
            <Link to="/login">
              <Button
                color="blue"
                className="text-white text-sm px-4 block mb-2"
              >
                Login
              </Button>
            </Link>
            <Link to="/register">
              <Button color="blue" className="text-white text-sm px-4 block">
                Signup
              </Button>
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
