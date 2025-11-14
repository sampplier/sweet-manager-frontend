import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import './index.css'
import App from './App'
import Login from './pages/Login'
import Products from './pages/Products'
import Orders from './pages/Orders'
import Dashboard from './pages/Dashboard'


function Root() {
const isAuth = !!localStorage.getItem('token')


return (
<BrowserRouter>
<Routes>
<Route path="/login" element={<Login />} />
<Route path="/" element={isAuth ? <App /> : <Navigate to="/login" replace />}>
<Route index element={<Dashboard />} />
<Route path="products" element={<Products />} />
<Route path="orders" element={<Orders />} />
<Route path="dashboard" element={<Dashboard />} />
</Route>
</Routes>
</BrowserRouter>
)
}


createRoot(document.getElementById('root')).render(<Root />)