import { useForm } from 'react-hook-form';
import { api } from '@/lib/api';
import { useRouter } from 'next/router';
import { useAuthStore } from '@/store/authStore';
import Link from 'next/link';
import { useState } from 'react';

export default function Login() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const router = useRouter();
  const setLogin = useAuthStore((state) => state.setLogin);
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data: any) => {
    try {
      setLoading(true);
      setServerError('');
      const response = await api.post('/auth/login', data);
      setLogin(response.data.usuario, response.data.token);
      router.push('/dashboard');
    } catch (error: any) {
      setServerError(error.response?.data?.error || 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-900">Iniciar Sesión</h1>

        {serverError && (
          <div className="bg-red-50 text-red-700 p-3 rounded mb-4">
            {serverError}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">Email</label>
            <input
              {...register('email', { required: 'El email es requerido' })}
              type="email"
              className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-indigo-600"
              placeholder="tu@email.com"
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{(errors.email as any).message}</p>}
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 font-medium mb-2">Contraseña</label>
            <input
              {...register('password', { required: 'La contraseña es requerida' })}
              type="password"
              className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-indigo-600"
              placeholder="Contraseña"
            />
            {errors.password && <p className="text-red-500 text-sm mt-1">{(errors.password as any).message}</p>}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-2 rounded font-medium hover:bg-indigo-700 disabled:bg-gray-400"
          >
            {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
          </button>
        </form>

        <p className="text-center text-gray-600 mt-4">
          ¿No tienes cuenta? <Link href="/registro" className="text-indigo-600 font-medium hover:underline">Regístrate aquí</Link>
        </p>
      </div>
    </div>
  );
}
