/*import React, { useContext } from 'react'
import { UserContext } from "../../context/userContext"
import Navbar from './Navbar';

const DashboardLayout = ({children}) => {
  const {user} = useContext(UserContext);
    return (
    <div>
      <Navbar />

      {user && <div>{children}</div>}
    </div>
  )
}

export default DashboardLayout;*/

/*import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../context/userContext";
import Navbar from "./Navbar";

const DashboardLayout = ({ children }) => {
  const { user, clearUser } = useContext(UserContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    clearUser();
    localStorage.removeItem("token");
    navigate("/"); // redirect to landing page after logout
  };

  return (
    <div>
      <Navbar />

      {user && (
        <>
          <div className="flex justify-end gap-3 p-4 bg-white shadow-md">
            <button
              onClick={() => {
                window.open("http://localhost:5173", "_blank"); // adjust port if needed
              }}
              className="bg-blue-500 text-white text-sm px-4 py-1.5 rounded hover:bg-blue-600"
            >
              Back to LearnSphere
            </button>

            <button
              onClick={handleLogout}
              className="bg-red-500 text-white text-sm px-4 py-1.5 rounded hover:bg-red-600"
            >
              Logout
            </button>
          </div>

          <div>{children}</div>
        </>
      )}
    </div>
  );
};

export default DashboardLayout;*/

import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../context/userContext";
import Navbar from "./Navbar";

const DashboardLayout = ({ children }) => {
  const { user, clearUser } = useContext(UserContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    clearUser();
    localStorage.removeItem("token");
    navigate("/"); // redirect to landing page after logout
  };

  const goToLearnSphere = () => {
    window.location.href = "http://localhost:5173"; // open in same tab
  };

  return (
    <div>
      <Navbar />

      {user && (
        <>
          <div className="flex justify-end gap-3 p-4 bg-white shadow-md">
            <button
              onClick={goToLearnSphere}
              className="bg-violet-600 text-white text-sm px-4 py-1.5 rounded hover:bg-violet-600"
            >
              Back to LearnSphere
            </button>

            <button
              onClick={handleLogout}
              className="bg-red-500 text-white text-sm px-4 py-1.5 rounded hover:bg-red-600"
            >
              Logout
            </button>
          </div>

          <div>{children}</div>
        </>
      )}
    </div>
  );
};

export default DashboardLayout;


