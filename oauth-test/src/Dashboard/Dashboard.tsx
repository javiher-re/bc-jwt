import React, { useEffect, useState } from "react";
import axios from "axios";

import "./Dashboard.css";

interface Props {
  token: string;
  logout: () => void;
}

export const Dashboard: React.FC<Props> = ({ token, logout }) => {
  const [user, setUser] = useState<string | null>(null);

  const getProfile = async () => {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      const response = await axios.post(
        "http://localhost:8080/profile",
        null,
        config
      );

      if (!response.data) {
        logout();
        return;
      }

      setUser(response.data.user.email);
    } catch (error) {
      if (error.response) {
        console.error(error.response.data.message);
      } else if (error.request) {
        console.error("No response from server. Please try again later.");
      } else {
        console.error("An error occurred. Please try again.");
      }
      logout();
    }
  };

  useEffect(() => {
    getProfile();
  }, []);

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Welcome, {user}!</h1>
      </header>
      <main className="dashboard-main">
        <p>Le Dashboard</p>
      </main>
    </div>
  );
};
