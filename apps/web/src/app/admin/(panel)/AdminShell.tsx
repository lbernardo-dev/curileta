'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import type { AdminIdentity } from '@/lib/supabase/admin';

const navigation = [
  { href: '/admin', label: 'Resumen', roles: ['owner', 'admin', 'editor', 'analyst'] },
  { href: '/admin/contenidos', label: 'Contenidos', roles: ['owner', 'admin', 'editor'] },
  { href: '/admin/encuadres', label: 'Encuadres', roles: ['owner', 'admin', 'editor'] },
  { href: '/admin/forms', label: 'Formularios', roles: ['owner', 'admin'] },
  { href: '/admin/consultas', label: 'Consultas', roles: ['owner', 'admin'] },
  { href: '/admin/leads', label: 'Oportunidades', roles: ['owner', 'admin'] },
  { href: '/admin/estadisticas', label: 'Estadísticas', roles: ['owner', 'admin', 'analyst'] },
];

export function AdminShell({ identity, children }: { identity: AdminIdentity; children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [signingOut, setSigningOut] = useState(false);

  async function signOut() {
    setSigningOut(true);
    await fetch('/api/admin/auth/logout', { method: 'POST' });
    router.replace('/admin/login');
    router.refresh();
  }

  const roleLabel = identity.role === 'owner' ? 'Propietario'
    : identity.role === 'admin' ? 'Administración'
      : identity.role === 'editor' ? 'Edición' : 'Análisis';

  return (
    <div className="min-h-screen bg-[#f7f8f3] text-slate-900 dark:bg-[#181818] dark:text-white">
      <a href="#admin-main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-white focus:px-3 focus:py-2 focus:text-slate-900 focus-visible:ring-2 focus-visible:ring-emerald-600">
        Saltar al contenido
      </a>
      <div className="mx-auto flex min-h-screen max-w-screen-2xl flex-col lg:flex-row">
        <aside className="flex w-full flex-col border-b border-slate-200 bg-white p-4 dark:border-[#313131] dark:bg-[#1f1f1f] lg:w-64 lg:border-b-0 lg:border-r lg:p-6">
          <div className="flex items-center justify-between gap-4 lg:block">
            <div>
              <Link href="/admin" className="text-base font-bold text-emerald-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 dark:text-emerald-200">
                Curileta
              </Link>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">Panel del equipo</p>
            </div>
            <button
              type="button"
              onClick={signOut}
              disabled={signingOut}
              className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] hover:bg-slate-100 active:scale-[0.98] disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 dark:border-[#313131] dark:hover:bg-[#272727]"
            >
              {signingOut ? 'Saliendo…' : 'Cerrar sesión'}
            </button>
          </div>

          <nav aria-label="Navegación del panel" className="mt-6 flex gap-2 overflow-x-auto lg:flex-col">
            {navigation.filter((item) => item.roles.includes(identity.role)).map((item) => {
              const active = item.href === '/admin' ? pathname === item.href : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? 'page' : undefined}
                  className={`shrink-0 rounded-lg px-3 py-2 text-sm font-semibold transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 ${active ? 'bg-emerald-100 text-emerald-950 dark:bg-[#272727] dark:text-emerald-200' : 'text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-[#272727]'}`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="mt-6 hidden border-t border-slate-200 pt-4 dark:border-[#313131] lg:block">
            <p className="text-sm font-semibold">{identity.displayName}</p>
            <p className="mt-1 text-xs text-slate-600 dark:text-slate-300">{roleLabel}</p>
          </div>
        </aside>

        <main id="admin-main" tabIndex={-1} className="min-w-0 flex-1 p-4 outline-none sm:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
