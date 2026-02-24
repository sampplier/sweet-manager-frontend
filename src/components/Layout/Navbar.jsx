import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { jwtDecode } from 'jwt-decode'

export default function Navbar() {
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const decoded = token ? jwtDecode(token) : null;
  const role = decoded?.role || "USER";

  const logout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <header className="bg-white shadow">
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">

          <Link to="/home" className="text-xl font-semibold">
            Sweet-Manager
          </Link>

          <nav className="hidden md:flex gap-3">

            {role === "ROLE_ADMIN" && (
              <>
                <Link to="/dashboard" className="text-sm">Dashboard</Link>
                <Link to="/ingredients" className="text-sm">Ingredientes</Link>
              </>
            )}

            <Link to="/products" className="text-sm">Produtos</Link>
            <Link to="/orders" className="text-sm">Pedidos</Link>
          </nav>
        </div>

        <div>
          <button
            onClick={logout}
            className="text-sm px-3 py-1 rounded bg-red-500 text-white"
          >
            Sair
          </button>
        </div>
      </div>
    </header>
  );
}
