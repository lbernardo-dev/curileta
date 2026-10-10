'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';

export function AdminLoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/admin/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'No se pudo validar el acceso.');
      router.replace('/admin');
      router.refresh();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'No se pudo validar el acceso.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 space-y-6">
      {error && (
        <p role="alert" className="rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-800 dark:border-red-900 dark:bg-[#272727] dark:text-red-200">
          {error}
        </p>
      )}
      <div className="space-y-2">
        <label htmlFor="admin-email" className="block text-sm font-semibold">Correo electrónico</label>
        <input
          id="admin-email"
          name="email"
          type="email"
          autoComplete="username"
          required
          maxLength={320}
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="min-h-12 w-full rounded-lg border border-slate-300 bg-white px-3 text-base text-slate-900 outline-none transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] placeholder:text-slate-500 hover:border-emerald-600 focus-visible:ring-2 focus-visible:ring-emerald-600 dark:border-[#313131] dark:bg-[#181818] dark:text-white"
        />
      </div>
      <div className="space-y-2">
        <label htmlFor="admin-password" className="block text-sm font-semibold">Contraseña</label>
        <input
          id="admin-password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          maxLength={1024}
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="min-h-12 w-full rounded-lg border border-slate-300 bg-white px-3 text-base text-slate-900 outline-none transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] hover:border-emerald-600 focus-visible:ring-2 focus-visible:ring-emerald-600 dark:border-[#313131] dark:bg-[#181818] dark:text-white"
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="min-h-12 w-full rounded-lg bg-emerald-800 px-3 py-2 text-base font-semibold text-white transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] hover:bg-emerald-700 active:scale-[0.98] disabled:cursor-wait disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-[#1f1f1f]"
      >
        {loading ? 'Validando acceso…' : 'Entrar al panel'}
      </button>
    </form>
  );
}
