import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginFormSchema, LoginFormValues } from '../schemas/auth.schema';
import { useAuth } from '../hooks/useAuth';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { useToast } from '../../../components/ui/Toast';
import { Mail, Lock, ArrowRight, Truck } from 'lucide-react';

interface LoginFormProps {
  onSwitchToRegister: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onSwitchToRegister }) => {
  const { login, loginWithGoogle, isLoading } = useAuth();
  const { success, error: showError } = useToast();
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    setFormError(null);
    try {
      await login(data.email, data.password);
      success('Sessão iniciada!', 'Bem-vindo ao DeliveryControl.');
    } catch (err: any) {
      setFormError(err.message || 'Erro ao autenticar.');
      showError('Erro de autenticação', err.message || 'Verifique seu e-mail e senha.');
    }
  };

  const handleGoogleQuickLogin = async () => {
    setFormError(null);
    try {
      await loginWithGoogle();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Erro ao autenticar com Google';
      setFormError(message);
      showError('Erro de autenticação', message);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 sm:p-8 bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl relative">
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-lime-400 text-slate-950 mb-4 shadow-lg shadow-lime-400/20">
          <Truck className="w-7 h-7" strokeWidth={2.4} />
        </div>
        <h2 className="text-2xl font-bold text-white tracking-tight">Acessar DeliveryControl</h2>
        <p className="text-sm text-slate-400 mt-1">
          Gestão de entregas, combustível e controle financeiro
        </p>
      </div>

      {formError && (
        <div className="mb-5 p-3.5 bg-rose-950/70 border border-rose-800/80 rounded-xl text-xs text-rose-300 font-medium">
          {formError}
        </div>
      )}

      {/* Formulário de Autenticação */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="E-mail"
          type="email"
          placeholder="seu.email@exemplo.com"
          leftIcon={<Mail className="w-4 h-4" />}
          error={errors.email?.message}
          {...register('email')}
        />

        <Input
          label="Senha"
          type="password"
          placeholder="••••••••"
          leftIcon={<Lock className="w-4 h-4" />}
          error={errors.password?.message}
          {...register('password')}
        />

        <Button
          type="submit"
          variant="lime"
          className="w-full mt-2"
          isLoading={isLoading}
          rightIcon={<ArrowRight className="w-4 h-4" />}
        >
          Entrar no Sistema
        </Button>
      </form>

      {/* Divisor e Autenticação com Google Abaixo do Formulário */}
      <div className="my-5">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex-1 h-px bg-slate-800" />
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
            ou continue com
          </span>
          <div className="flex-1 h-px bg-slate-800" />
        </div>

        <button
          type="button"
          onClick={() => void handleGoogleQuickLogin()}
          disabled={isLoading}
          className="w-full py-3 px-4 bg-slate-800/90 hover:bg-slate-750 text-white font-semibold text-sm rounded-xl border border-slate-700 hover:border-slate-600 transition-all flex items-center justify-center gap-3 shadow-sm active:scale-[0.99] disabled:opacity-50 group"
        >
          {/* Google SVG Logo */}
          <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          <span className="group-hover:text-slate-100">Continuar com o Google</span>
        </button>
      </div>

      <div className="mt-5 text-center text-xs text-slate-400">
        Não tem uma conta?{' '}
        <button
          type="button"
          onClick={onSwitchToRegister}
          className="text-lime-400 hover:underline font-semibold"
        >
          Cadastre-se gratuitamente
        </button>
      </div>

    </div>
  );
};
