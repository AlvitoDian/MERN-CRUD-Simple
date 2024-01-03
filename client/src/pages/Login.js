import React from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessages, setErrorMessages] = useState({});

  axios.defaults.withCredentials = true;

  // Handle Submit
  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post("http://localhost:5000/login", { email, password })
      .then((result) => {
        console.log(result);
        if (result.data == "Success") {
          navigate("/");
        }
      })
      .catch((error) => {
        if (
          error.response &&
          error.response.data &&
          error.response.data.errors
        ) {
          const validationErrors = error.response.data.errors.map(
            (validationError) => validationError.msg
          );

          setErrorMessages(validationErrors);
        } else {
          console.error("Error:", error.message);
        }
      });
  };

  return (
    <div className="bg-gradient-to-r from-blue-500 to-indigo-500">
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-white p-8 rounded-xl shadow-md md:w-96 w-full">
          <h2 className="text-2xl font-bold mb-4">Login</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="email" className="block text-gray-600 ">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={email}
                className="w-full border-gray-300 rounded-md p-2 bg-indigo-500 bg-opacity-10"
                placeholder="Enter your email"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <label htmlFor="password" className="block text-gray-600">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={password}
                className="w-full border-gray-300 rounded-md p-2 bg-indigo-500 bg-opacity-10"
                placeholder="Enter Password"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600"
            >
              Login
            </button>
          </form>
          {errorMessages.length > 0 && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mt-5">
              <p>Error : </p>
              <ul>
                {errorMessages.map((errorMessage, index) => (
                  <li key={index}>{errorMessage}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
