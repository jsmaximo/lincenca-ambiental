"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";

import { Usuario } from "@/types/usuario";


interface Role {
  id: number;
  nome: string;
}
interface ModalUsuarioProps {
  open: boolean;
  onClose: () => void;
  usuario: Usuario | null;
}

export function ModalUsuario({
  open,
  onClose,
  usuario,
}: ModalUsuarioProps) {
  const isEdicao = Boolean(usuario);

  const [roles, setRoles] = useState<Role[]>([]);
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [roleId, setRoleId] = useState("");
  const [ativo, setAtivo] = useState(true);

  /* ======================
     CARREGAR ROLES
  ====================== */
  useEffect(() => {
    if (!open) return;

    fetch("/api/roles")
      .then((res) => res.json())
      .then(setRoles);
  }, [open]);

  /* ======================
     SINCRONIZAR EDIÇÃO
  ====================== */
  useEffect(() => {
    if (!open) return;

    if (usuario) {
      setNome(usuario.nome);
      setEmail(usuario.email);
      setRoleId(String(usuario.roleId));
      setAtivo(usuario.ativo);
      setSenha("");
    } else {
      setNome("");
      setEmail("");
      setSenha("");
      setRoleId("");
      setAtivo(true);
    }
  }, [usuario, open]);

  /* ======================
     SALVAR
  ====================== */
  async function salvar() {
    if (!nome || !email || !roleId) {
      alert("Preencha todos os campos obrigatórios");
      return;
    }

    if (!isEdicao && !senha) {
      alert("Senha obrigatória no cadastro");
      return;
    }

    const payload: any = {
      nome,
      email,
      roleId: Number(roleId),
      ativo,
    };

    if (senha) payload.senha = senha;

    const res = await fetch(
      isEdicao
        ? `/api/usuarios/${usuario!.id}`
        : "/api/usuarios",
      {
        method: isEdicao ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }
    );

    if (!res.ok) {
      alert("Erro ao salvar usuário");
      return;
    }

    onClose();
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-xl rounded-xl shadow-lg p-6 space-y-6">

        <h3 className="text-xl font-bold">
          {isEdicao ? "Editar Usuário" : "Novo Usuário"}
        </h3>

        <div className="space-y-4">
          <Input
            label="Nome"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
          />

          <Input
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <Input
            label={`Senha ${isEdicao ? "(opcional)" : ""}`}
            type="password"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
          />

          <Select
            label="Perfil"
            value={roleId}
            onChange={(e) => setRoleId(e.target.value)}
            options={[
              { value: "", label: "Selecione..." },
              ...roles.map((r) => ({
                value: String(r.id),
                label: r.nome,
              })),
            ]}
          />

          <Select
            label="Status"
            value={ativo ? "1" : "0"}
            onChange={(e) => setAtivo(e.target.value === "1")}
            options={[
              { value: "1", label: "Ativo" },
              { value: "0", label: "Inativo" },
            ]}
          />
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded"
          >
            Cancelar
          </button>

          <button
            onClick={salvar}
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            {isEdicao ? "Salvar Alterações" : "Criar Usuário"}
          </button>
        </div>
      </div>
    </div>
  );
}
