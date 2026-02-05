"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {useRouter} from "next/navigation";

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();

  const router = useRouter();

  async function handleLogout() {
  await fetch("/api/logout", { method: "POST" });
  router.push("/login");
}

  return (
    <aside
      className={`bg-gray-800 text-white transition-all duration-300
      ${collapsed ? "w-20" : "w-64"} flex flex-col`}
    >
      {/* TOPO */}
      <div className="p-4 flex items-center gap-2">
        <span className="text-2xl">🌱</span>
        {!collapsed && (
          <h1 className="font-bold text-sm">
            Controle de Licenças Ambientais
          </h1>
        )}
      </div>

      <hr className="border-gray-700" />

      {/* MENU */}
      <nav className="flex-1 mt-4">
        <Link
          href="/dashboard"
          className="flex items-center gap-3 px-4 py-3 hover:bg-gray-700 transition"
        >
          <span className="text-xl">📊</span>
          {!collapsed && <span>Dashboard</span>}
        </Link>

        <Link
          href="/dashboard/licencas"
          className="flex items-center gap-3 px-4 py-3 hover:bg-gray-700 transition"
        >
          <span className="text-xl">📄</span>
          {!collapsed && <span>Licenças</span>}
        </Link>

        <Link
          href="/dashboard/calendario"
          className="flex items-center gap-3 px-4 py-3 hover:bg-gray-700 transition"
        >
          <span className="text-xl">📅</span>
          {!collapsed && <span>Calendário</span>}
        </Link>

        <Link
  href="/dashboard/empreendimentos"
  className="flex items-center gap-3 px-4 py-3 hover:bg-gray-700 transition"
>
  <span className="text-xl">🏢</span>
  {!collapsed && <span>Empreendimentos</span>}
</Link>


<Link
  href="/dashboard/condicionantes"
  className="flex items-center gap-3 px-4 py-3 hover:bg-gray-700 transition"
>
  <span className="text-xl">📌</span>
  {!collapsed && <span>Condicionantes</span>}
</Link>


  <Link
    href="/dashboard/usuarios"
    className={`flex items-center gap-3 px-4 py-3 transition
      hover:bg-gray-700
      ${pathname === "/dashboard/usuarios" ? "bg-gray-700" : ""}
    `}
  >
    <span className="text-xl">👥</span>
    {!collapsed && <span>Usuários</span>}
  </Link>

      </nav>



      <button
  onClick={handleLogout}
  className="flex items-center gap-3 px-4 py-3 text-red-300 hover:bg-gray-700 transition"
>
  <span className="text-xl">🚪</span>
  {!collapsed && <span>Sair</span>}
</button>

      {/* BOTÃO RECOLHER */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="p-4 border-t border-gray-700 hover:bg-gray-700 transition"
      >
        {collapsed ? "➡️" : "⬅️"}
      </button>
    </aside>
  );
}
