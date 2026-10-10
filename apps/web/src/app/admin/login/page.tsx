import type { Metadata } from 'next';
import Link from 'next/link';
import { AdminLoginForm } from './AdminLoginForm';

export const metadata: Metadata = {
  title: 'Acceso del equipo',
  robots: { index: false, follow: false },
};

export default function AdminLoginPage() {
  return (
    <main className="min-h-screen bg-[#f7f8f3] px-4 py-16 text-slate-900 dark:bg-[#181818] dark:text-white sm:py-24">
      <section className="mx-auto w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-xl dark:border-[#313131] dark:bg-[#1f1f1f] sm:p-10">
        <Link href="/es" className="text-sm font-semibold text-emerald-800 hover:text-emerald-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2 dark:text-emerald-300 dark:focus-visible:ring-offset-[#1f1f1f]">
          Las Aventuras de Curileta
        </Link>
        <h1 className="mt-8 text-balance text-3xl font-bold tracking-tight">Acceso del equipo</h1>
        <p className="text-pretty mt-3 text-sm leading-5 text-slate-600 dark:text-slate-300">
          Entra para revisar las consultas y administrar los formularios del sitio.
        </p>
        <AdminLoginForm />
      </section>
    </main>
  );
}
