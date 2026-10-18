
import { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Home from "./pages/Home.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Scorer from "./pages/Scorer.jsx";

import InterviewStart from "./pages/interviewStart.jsx";
import InterviewPage from "./pages/interviewPage.jsx";
import InterviewReport from "./pages/interviewReport.jsx";

import { getCurrentUser } from "./apis/user.api.js";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load the logged-in user's session when the app starts.
  useEffect(() => {
    let mounted = true;

    const loadUser = async () => {
      try {
        const data = await getCurrentUser();

        if (mounted) {
          setUser(data?.success && data?.user ? data.user : null);
        }
      } catch (error) {
        console.error("Failed to load current user:", error);

        if (mounted) {
          setUser(null);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadUser();

    // Prevent state updates after unmount.
    return () => {
      mounted = false;
    };
  }, []);

  // Display a loading screen while checking authentication.
  if (loading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-100">
        <div className="h-1 w-full animate-pulse bg-black" />
      </div>
    );
  }

  return (
    <Routes>
      {/* Home / Login */}
      <Route
        path="/"
        element={
          user ? (
            <Navigate to="/dashboard" replace />
          ) : (
            <Home setUser={setUser} />
          )
        }
      />

      {/* Dashboard */}
      <Route
        path="/dashboard"
        element={
          user ? (
            <Dashboard user={user} setUser={setUser} />
          ) : (
            <Navigate to="/" replace />
          )
        }
      />

      {/* Resume Analyzer */}
      <Route
        path="/scorer"
        element={
          user ? (
            <Scorer user={user} setUser={setUser} />
          ) : (
            <Navigate to="/" replace />
          )
        }
      />

      {/* Interview Setup */}
      <Route
        path="/interview/start"
        element={
          user ? (
            <InterviewStart user={user} />
          ) : (
            <Navigate to="/" replace />
          )
        }
      />

      {/* Active Interview */}
      <Route
        path="/interview"
        element={
          user ? (
            <InterviewPage user={user} />
          ) : (
            <Navigate to="/" replace />
          )
        }
      />

      {/* Interview Report */}
      <Route
        path="/interview/report/:interviewId"
        element={
          user ? (
            <InterviewReport user={user} />
          ) : (
            <Navigate to="/" replace />
          )
        }
      />

      {/* Redirect unknown routes */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
