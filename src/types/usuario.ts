export interface Role {
  id: number;
  nome: string;
}

export interface Usuario {
  id: number;
  nome: string;
  email: string;
  ativo: boolean;
  role: Role;
  roleId: number;
}
