import { betterAuthClient } from './better-auth.client';
import { User } from '../../../types';
import { LoginFormValues, RegisterFormValues } from '../schemas/auth.schema';

function toAppUser(user: {
  id: string;
  name: string;
  email?: string;
  createdAt: Date | string;
}): User {
  if (!user.email) {
    throw new Error('A sessão Better Auth não possui e-mail');
  }

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    createdAt: new Date(user.createdAt).toISOString(),
  };
}

export class AuthService {
  public static async login(data: LoginFormValues): Promise<User> {
    const result = await betterAuthClient.signIn.email({
      email: data.email,
      password: data.password,
    });

    if (result.error || !result.data?.user) {
      throw new Error(result.error?.message || 'Não foi possível iniciar a sessão');
    }

    return toAppUser(result.data.user);
  }

  public static async register(data: RegisterFormValues): Promise<User> {
    const result = await betterAuthClient.signUp.email({
      name: data.name,
      email: data.email,
      password: data.password,
    });

    if (result.error || !result.data?.user) {
      throw new Error(result.error?.message || 'Não foi possível criar a conta');
    }

    return toAppUser(result.data.user);
  }

  public static async loginWithGoogle(): Promise<void> {
    const result = await betterAuthClient.signIn.social({
      provider: 'google',
      callbackURL: `${window.location.origin}/dashboard`,
    });

    if (result.error) {
      throw new Error(result.error.message || 'Não foi possível autenticar com Google');
    }

    // better-auth pode retornar a URL em vez de redirecionar sozinho.
    const url = (result.data as { url?: string } | null)?.url;
    if (url) {
      window.location.href = url;
    }
    // Se redirecionou sozinho, a página recarrega e o initialize() busca a sessão.
  }

  public static async getSession(): Promise<User | null> {
    const result = await betterAuthClient.getSession({ query: {} });

    if (result.error) {
      throw new Error(result.error.message || 'Não foi possível recuperar a sessão');
    }

    return result.data?.user ? toAppUser(result.data.user) : null;
  }

  public static async logout(): Promise<void> {
    const result = await betterAuthClient.signOut({});

    if (result.error) {
      throw new Error(result.error.message || 'Não foi possível encerrar a sessão');
    }
  }
}
