"use client";

import { useEffect, useState } from "react";
import { DashboardHeader } from "@/components/layout/DashboardHeader";
import { ModalUsuario } from "@/components/usuarios/ModalUsuario";
import { Usuario } from "@/types/usuario";

interface Role {
  id: number;
  nome: string;
}
export default function UsuariosPage() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<Usuario | null>(null);

  async function carregarUsuarios() {
    const res = await fetch("/api/usuarios");
    const data = await res.json();
    setUsuarios(data);
  }

  useEffect(() => {
    carregarUsuarios();
  }, []);

  return (
    <div className="space-y-6">

      <DashboardHeader
        title="Usuários"
        subtitle="Gerencie os usuários do sistema"
        action={
          <button
            onClick={() => {
              setSelected(null);
              setOpen(true);
            }}
            className="bg-green-700 text-white px-4 py-2 rounded hover:bg-green-800"
          >
            Novo Usuário
          </button>
        }
      />

      {/* LISTAGEM */}
      <div className="bg-white rounded shadow overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="px-4 py-3">Nome</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Perfil</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Ações</th>
            </tr>
          </thead>

          <tbody>
            {usuarios.map((u) => (
              <tr key={u.id} className="border-t">
                <td className="px-4 py-3">{u.nome}</td>
                <td className="px-4 py-3">{u.email}</td>
                <td className="px-4 py-3">{u.role.nome}</td>
                <td className="px-4 py-3">
                  <span
                    className={`px-2 py-1 rounded text-xs ${
                      u.ativo
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {u.ativo ? "Ativo" : "Inativo"}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => {
                      setSelected(u);
                      setOpen(true);
                    }}
                    className="text-blue-600 hover:underline text-sm"
                  >
                    Editar
                  </button>
                </td>
              </tr>
            ))}

            {usuarios.length === 0 && (
              <tr>
                <td
                  colSpan={5}
                  className="px-4 py-6 text-center text-gray-500"
                >
                  Nenhum usuário cadastrado.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <ModalUsuario
        open={open}
        usuario={selected}
        onClose={() => {
          setOpen(false);
          setSelected(null);
          carregarUsuarios();
        }}
      />
    </div>
  );
}
