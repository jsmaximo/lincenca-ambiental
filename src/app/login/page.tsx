"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErro("");

    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, senha }),
    });

    if (!res.ok) {
      setErro("Email ou senha inválidos");
      return;
    }

    // ✅ LOGIN OK → DASHBOARD
    router.push("/dashboard");
  }

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2">
      
      {/* BLOCO ESQUERDO - FORMULÁRIO */}
      <div className="flex items-center justify-center bg-white px-8">
        <div className="w-full max-w-md">

          {/* LOGO */}
          <div className="mb-8 text-center">
            <img
              src="/logo.png"
              alt="Logo da Empresa"
              className="mx-auto h-16 mb-4"
            />

            <h1 className="text-2xl font-bold text-gray-800">
              Seja bem-vindo!
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Faça login para continuar
            </p>
          </div>

          {/* FORMULÁRIO */}
          <form onSubmit={handleSubmit} className="space-y-4">

            {erro && (
              <p className="text-sm text-red-600 text-center">
                {erro}
              </p>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700">
                E-mail
              </label>
              <input
                type="email"
                placeholder="admin@licenca.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-600"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Senha
              </label>
              <input
                type="password"
                placeholder="admin123"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-600"
              />
            </div>

            <button
              type="submit"
              className="w-full rounded-md bg-green-700 py-2 text-white font-semibold hover:bg-green-800 transition"
            >
              Login
            </button>
          </form>

        </div>
      </div>

      {/* BLOCO DIREITO - INSTITUCIONAL */}
      <div
        className="hidden md:flex items-center justify-center bg-cover bg-center px-10"
        style={{ backgroundImage: "url('/login-bg.jpg')" }}
      >
        <div className="text-white max-w-lg">
          <h2 className="text-4xl font-bold mb-4">
            Sistema de Controle de Licenças Ambientais
          </h2>
          <p className="text-lg">
            Controle de licenças ambientais dos empreendimentos da VCA Construtora
          </p>
        </div>
      </div>

    </div>
  );
}
