import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import "./styles/index.css";

import Home from "./pages/Home";
import App from "./App";
import Login from "./pages/Login";
import Register from "./pages/Register"; 
import Products from "./pages/Products";
import Orders from "./pages/Orders";
import Dashboard from "./pages/Dashboard";
import Ingredients from "./pages/Ingredients";
import Cart from "./pages/Cart";


function AdminRoute({ children }) {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  let decoded;
  try {
    decoded = jwtDecode(token);
  } catch (e) {
    return <Navigate to="/login" replace />;
  }

  const isAdmin = decoded.role === "ROLE_ADMIN";

  return isAdmin ? children : <Navigate to="/" replace />;
}

function Root() {
  const [isAuth, setIsAuth] = useState(!!localStorage.getItem("token"));

  useEffect(() => {
    const handleStorage = () => {
      setIsAuth(!!localStorage.getItem("token"));
    };

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  return (
    <BrowserRouter>
      <Routes>

        {/* Rotas públicas */}
        <Route path="/login" element={<Login onLogin={() => setIsAuth(true)} />} />
        <Route path="/register" element={<Register />} />   

        {/* Rotas protegidas */}
        <Route
          path="/"
          element={isAuth ? <App /> : <Navigate to="/login" replace />}
        >
          <Route index element={<Home />} />
          <Route path="home" element={<Home />} />
          <Route path="products" element={<Products />} />
          <Route path="orders" element={<Orders />} />
          <Route path="cart" element={<Cart />} />

          {/* Somente ADMIN */}
          <Route
            path="ingredients"
            element={
              <AdminRoute>
                <Ingredients />
              </AdminRoute>
            }
          />
          <Route
            path="dashboard"
            element={
              <AdminRoute>
                <Dashboard />
              </AdminRoute>
            }
          />
        </Route>

      </Routes>
    </BrowserRouter>
  );
}

createRoot(document.getElementById("root")).render(<Root />);
