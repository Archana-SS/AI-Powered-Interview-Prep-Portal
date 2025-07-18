/*import React from 'react'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";

//import Login from "./pages/Auth/Login";
//import SignUp from "./pages/Auth/SignUp";
import LandingPage from "./pages/LandingPage";
import Dashboard from "./pages/Home/Dashboard";
import InterviewPrep from "./pages/InterviewPrep/InterviewPrep";
import UserProvider from './context/userContext';

const App = () => {
  return (
    <UserProvider>
      <div>
        <Router>
          <Routes>
            <Route path="/" element={<LandingPage />} />

            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/interview-prep/:sessionId" element={<InterviewPrep />} />
          </Routes>
        </Router>

        <Toaster
          toastOptions={{
            className: "",
            style: {
              fontSize: "13px",
            },
          }}
        />
      </div>
    </UserProvider>
  )
}

export default App;*/

/*import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Home/Dashboard';
import InterviewPrep from './pages/InterviewPrep/InterviewPrep';
import UserProvider from './context/userContext';
import axios from 'axios';

// Component that handles SSO redirect logic
const AppWithSSO = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const urlToken = new URLSearchParams(window.location.search).get('token');

    if (urlToken) {
      // Save token in localStorage
      localStorage.setItem('token', urlToken);
      // Set default axios Authorization header
      axios.defaults.headers.common['Authorization'] = `Bearer ${urlToken}`;
      // Clean URL and redirect to dashboard
      navigate('/dashboard');
    } else {
      const token = localStorage.getItem('token');
      if (token) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      } else {
        navigate('/'); // fallback
      }
    }
  }, []);

  return (
    <>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/interview-prep/:sessionId" element={<InterviewPrep />} />
      </Routes>
    </>
  );
};

const App = () => {
  return (
    <UserProvider>
      <Router>
        <AppWithSSO />
        <Toaster
          toastOptions={{
            className: '',
            style: {
              fontSize: '13px',
            },
          }}
        />
      </Router>
    </UserProvider>
  );
};

export default App;*/

import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import LandingPage from "./pages/LandingPage";
import Dashboard from "./pages/Home/Dashboard";
import InterviewPrep from "./pages/InterviewPrep/InterviewPrep";
import UserProvider, { useUser } from "./context/userContext";

const AppWithSSO = () => {
  const navigate = useNavigate();
  const { loading, user } = useUser();
  const isAuth = !!user;

  // Step 1: Save token from URL to localStorage
  useEffect(() => {
    const tokenFromUrl = new URLSearchParams(window.location.search).get("token");
    if (tokenFromUrl) {
      localStorage.setItem("token", tokenFromUrl);
      window.history.replaceState({}, document.title, "/dashboard");
    }
  }, []);

  // Step 2: Wait for auth to finish
  if (loading) return <p className="text-center py-10">Validating your session...</p>;

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/dashboard" element={isAuth ? <Dashboard /> : <Navigate to="/" />} />
      <Route path="/interview-prep/:sessionId" element={isAuth ? <InterviewPrep /> : <Navigate to="/" />} />
    </Routes>
  );
};

const App = () => {
  return (
    <UserProvider>
      <Router>
        <AppWithSSO />
        <Toaster
          toastOptions={{
            className: "",
            style: { fontSize: "13px" },
          }}
        />
      </Router>
    </UserProvider>
  );
};

export default App;


