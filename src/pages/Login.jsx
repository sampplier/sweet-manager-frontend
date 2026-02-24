import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login({ onLogin }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!response.ok) throw new Error("Falha no login");

      const data = await response.json();

      localStorage.setItem("token", data.token);
      if (onLogin) onLogin();

      navigate("/home");
    } catch (err) {
      console.error(err);
      setError("Email ou senha incorretos.");
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-2xl shadow-md w-full max-w-sm space-y-4"
      >
        <h2 className="text-2xl font-bold text-center text-gray-800">Login</h2>
        {error && <p className="text-center text-red-500 font-medium">{error}</p>}
        <input
          type="email"
          name="email"
          placeholder="Email"
          className="border rounded w-full p-2"
          value={form.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Senha"
          className="border rounded w-full p-2"
          value={form.password}
          onChange={handleChange}
          required
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Entrar
        </button>
        <button
          type="button"
          onClick={() => navigate("/register")}
          className="w-full bg-gray-500 text-white py-2 rounded hover:bg-gray-600"
        >
          Criar conta
        </button>
      </form>
    </div>
  );
}
