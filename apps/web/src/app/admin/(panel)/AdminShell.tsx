'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import type { AdminIdentity } from '@/lib/supabase/admin';
import type { LucideIcon } from 'lucide-react';
import {
  LayoutDashboard,
  BarChart3,
  BookOpen,
  Feather,
  Mail,
  FileText,
  Crop,
  Compass,
  Image as ImageIcon,
  Youtube,
  Tv,
  Sparkles,
  HelpCircle,
  Smile,
  FileDown,
  ClipboardList,
  Inbox,
  Target,
  Users,
  Activity,
  LogOut,
} from 'lucide-react';

interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  roles: Array<'owner' | 'admin' | 'editor' | 'analyst'>;
}

interface NavGroup {
  category: string;
  items: NavItem[];
}

const navigationGroups: NavGroup[] = [
  {
    category: 'Visión General',
    items: [
      { href: '/admin', label: 'Resumen', icon: LayoutDashboard, roles: ['owner', 'admin', 'editor', 'analyst'] },
      { href: '/admin/estadisticas', label: 'Estadísticas', icon: BarChart3, roles: ['owner', 'admin', 'analyst'] },
    ],
  },
  {
    category: 'Editorial & Libros',
    items: [
      { href: '/admin/libros', label: 'Catálogo y libros de autoras', icon: BookOpen, roles: ['owner', 'admin', 'editor'] },
      { href: '/admin/autoras', label: 'Páginas de autoras', icon: Feather, roles: ['owner', 'admin', 'editor'] },
      { href: '/admin/cartas', label: 'Cartas a Pompón', icon: Mail, roles: ['owner', 'admin', 'editor'] },
      { href: '/admin/contenidos', label: 'Contenido general', icon: FileText, roles: ['owner', 'admin', 'editor'] },
      { href: '/admin/encuadres', label: 'Encuadres y máscaras', icon: Crop, roles: ['owner', 'admin', 'editor'] },
    ],
  },
  {
    category: 'Mundo & Audiovisual',
    items: [
      { href: '/admin/destinos', label: 'Destinos en atlas', icon: Compass, roles: ['owner', 'admin', 'editor'] },
      { href: '/admin/galeria', label: 'Galería de arte', icon: ImageIcon, roles: ['owner', 'admin', 'editor'] },
      { href: '/admin/youtube', label: 'Canal de YouTube', icon: Youtube, roles: ['owner', 'admin', 'editor'] },
      { href: '/admin/proximo-episodio', label: 'Próximo episodio', icon: Tv, roles: ['owner', 'admin', 'editor'] },
    ],
  },
  {
    category: 'Campañas & Eventos',
    items: [
      { href: '/admin/eventos', label: 'Eventos y ambientes', icon: Sparkles, roles: ['owner', 'admin', 'editor'] },
      { href: '/admin/acertijos', label: 'Acertijos de temporada', icon: HelpCircle, roles: ['owner', 'admin', 'editor'] },
      { href: '/admin/mascaras', label: 'Máscaras descargables', icon: Smile, roles: ['owner', 'admin', 'editor'] },
      { href: '/admin/recursos-imprimibles', label: 'Láminas y PDF', icon: FileDown, roles: ['owner', 'admin', 'editor'] },
    ],
  },
  {
    category: 'Comunidad & Mensajes',
    items: [
      { href: '/admin/forms', label: 'Formularios', icon: ClipboardList, roles: ['owner', 'admin'] },
      { href: '/admin/consultas', label: 'Bandeja de consultas', icon: Inbox, roles: ['owner', 'admin'] },
      { href: '/admin/leads', label: 'Oportunidades', icon: Target, roles: ['owner', 'admin'] },
    ],
  },
  {
    category: 'Ajustes & Sistema',
    items: [
      { href: '/admin/equipo', label: 'Equipo y accesos', icon: Users, roles: ['owner'] },
      { href: '/admin/sistema', label: 'Estado del sistema', icon: Activity, roles: ['owner', 'admin'] },
    ],
  },
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

  const userInitial = (identity.displayName || identity.email || 'A').slice(0, 1).toUpperCase();

  return (
    <div className="min-h-screen bg-[#f7f8f3] text-slate-900 transition-colors duration-500 dark:bg-[#181818] dark:text-white">
      <a
        href="#admin-main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-white focus:px-4 focus:py-2.5 focus:text-slate-900 focus-visible:ring-2 focus-visible:ring-emerald-600 shadow-xl"
      >
        Saltar al contenido
      </a>
      <div className="mx-auto flex min-h-screen max-w-screen-2xl flex-col lg:flex-row">
        {/* Sidebar */}
        <aside className="flex w-full shrink-0 flex-col border-b border-slate-200/90 bg-white p-4 dark:border-[#313131] dark:bg-[#1f1f1f] lg:w-72 lg:border-b-0 lg:border-r lg:p-6">
          <div className="flex items-center justify-between gap-4 border-b border-slate-100 pb-4 dark:border-[#272727] lg:border-b-0 lg:pb-0">
            <div>
              <Link
                href="/admin"
                className="font-display text-lg font-bold tracking-tight text-emerald-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 dark:text-emerald-300"
              >
                Curileta Admin
              </Link>
              <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">Consola de gestión oficial</p>
            </div>
            <button
              type="button"
              onClick={signOut}
              disabled={signingOut}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700 transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] hover:bg-slate-100 active:scale-[0.98] disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 dark:border-[#313131] dark:text-slate-200 dark:hover:bg-[#272727] lg:hidden"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span>{signingOut ? 'Saliendo…' : 'Salir'}</span>
            </button>
          </div>

          {/* Navegación enriquecida categorizada */}
          <nav aria-label="Navegación del panel" className="mt-4 flex gap-1.5 overflow-x-auto pb-2 lg:mt-6 lg:flex-col lg:gap-5 lg:overflow-x-visible lg:pb-0">
            {navigationGroups.map((group) => {
              const visibleItems = group.items.filter((item) => item.roles.includes(identity.role));
              if (!visibleItems.length) return null;

              return (
                <div key={group.category} className="shrink-0 space-y-1 lg:shrink">
                  <p className="hidden px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-400 lg:block">
                    {group.category}
                  </p>
                  <div className="flex gap-1.5 lg:flex-col lg:gap-1">
                    {visibleItems.map((item) => {
                      const Icon = item.icon;
                      const active = item.href === '/admin' ? pathname === item.href : pathname.startsWith(item.href);

                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          aria-current={active ? 'page' : undefined}
                          className={`group inline-flex shrink-0 items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 sm:text-sm lg:shrink ${
                            active
                              ? 'bg-emerald-100/90 font-bold text-emerald-950 shadow-sm ring-1 ring-emerald-500/30 dark:bg-[#272727] dark:text-emerald-300 dark:ring-emerald-400/30'
                              : 'text-slate-700 hover:bg-slate-100/80 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-[#272727] dark:hover:text-white'
                          }`}
                        >
                          <Icon
                            className={`h-4 w-4 shrink-0 transition-transform duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:scale-110 ${
                              active ? 'text-emerald-800 dark:text-emerald-300' : 'text-slate-500 dark:text-slate-400'
                            }`}
                            aria-hidden="true"
                          />
                          <span className="truncate">{item.label}</span>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </nav>

          {/* User profile footer en escritorio */}
          <div className="mt-auto hidden border-t border-slate-200 pt-5 dark:border-[#313131] lg:block">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-800 text-xs font-bold text-amber-300 shadow-sm">
                  {userInitial}
                </div>
                <div className="min-w-0">
                  <p className="truncate text-xs font-bold text-slate-900 dark:text-white">{identity.displayName}</p>
                  <p className="truncate text-[11px] font-medium text-emerald-700 dark:text-emerald-400">{roleLabel}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={signOut}
                disabled={signingOut}
                title="Cerrar sesión"
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-slate-300 text-slate-600 transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] hover:bg-slate-100 hover:text-slate-900 active:scale-[0.98] disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 dark:border-[#313131] dark:text-slate-300 dark:hover:bg-[#272727] dark:hover:text-white"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          </div>
        </aside>

        {/* Contenido principal */}
        <main id="admin-main" tabIndex={-1} className="min-w-0 flex-1 p-4 outline-none sm:p-8 lg:p-10">
          {children}
        </main>
      </div>
    </div>
  );
}
