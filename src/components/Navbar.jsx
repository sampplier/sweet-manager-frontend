import React from 'react'
import { Link, useNavigate } from 'react-router-dom'


export default function Navbar() {
const navigate = useNavigate()
const logout = () => {
localStorage.removeItem('token')
navigate('/login')
}


return (
<header className="bg-white shadow">
<div className="container mx-auto px-6 py-4 flex items-center justify-between">
<div className="flex items-center gap-4">
<h1 className="text-xl font-semibold">Sweet-Manager</h1>
<nav className="hidden md:flex gap-3">
<Link to="/dashboard" className="text-sm">Dashboard</Link>
<Link to="/products" className="text-sm">Produtos</Link>
<Link to="/orders" className="text-sm">Pedidos</Link>
</nav>
</div>
<div>
<button onClick={logout} className="text-sm px-3 py-1 rounded bg-red-500 text-white">Sair</button>
</div>
</div>
</header>
)
}