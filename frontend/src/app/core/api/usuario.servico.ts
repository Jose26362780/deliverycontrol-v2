import dadosUsuarioMock from '../mock/usuario.json';

export interface PerfilUsuario {
  id: string;
  nome: string;
  email: string;
  documento: string;
  telefone: string;
  urlFoto: string;
  cargo: string;
}

export type UsuarioBancario = PerfilUsuario;

export class ServicoUsuario {
  private usuario: PerfilUsuario = { ...dadosUsuarioMock };

  async obterUsuario(): Promise<PerfilUsuario> {
    await new Promise((resolve) => setTimeout(resolve, 60));
    return { ...this.usuario };
  }

  async atualizarUsuario(atualizacoes: Partial<PerfilUsuario>): Promise<PerfilUsuario> {
    await new Promise((resolve) => setTimeout(resolve, 100));
    this.usuario = { ...this.usuario, ...atualizacoes };
    return { ...this.usuario };
  }
}

export const servicoUsuario = new ServicoUsuario();

// Compatibilidade
export type UserProfile = PerfilUsuario;
export const userService = {
  getUser: async () => {
    const u = await servicoUsuario.obterUsuario();
    return {
      id: u.id,
      name: u.nome,
      email: u.email,
      document: u.documento,
      phone: u.telefone,
      avatarUrl: u.urlFoto,
      role: u.cargo,
    };
  },
  updateUser: (updates: any) => servicoUsuario.atualizarUsuario(updates),
};
