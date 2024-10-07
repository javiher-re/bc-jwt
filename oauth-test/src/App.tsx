import React, { useState } from "react";
import axios from "axios";

import { Login } from "./Login/Login";
import { Dashboard } from "./Dashboard/Dashboard";

import "./App.css";

function App() {
  const [userToken, setUserToken] = useState<string | null>(null);

  const handleLogout = () => {
    setUserToken(null);
  };

  const handleSubmit = async (email, password) => {
    try {
      const response = await axios.post("http://localhost:8080/login", {
        email,
        password,
      });

      if (!response.data) return;

      setUserToken(response.data);
    } catch (error) {
      if (error.response) {
        alert(error.response.data.message);
      } else if (error.request) {
        alert("No response from server. Please try again later.");
      } else {
        alert("An error occurred. Please try again.");
      }
    }
  };

  return userToken ? (
    <Dashboard token={userToken} logout={handleLogout} />
  ) : (
    <Login login={handleSubmit} />
  );
}

export default App;
