import React from "react";
import { Outlet, Navigate } from "react-router-dom";
import Navbar from "./components/Layout/Navbar.jsx";


function PrivateRoute() {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}

export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="p-6 flex-1">
        <Outlet />
      </main>
    </div>
  );
}

export { PrivateRoute };
