import type { LucideIcon } from 'lucide-react';

export function SectionEmblem({ icon: Icon, tone = 'amber', label }: { icon: LucideIcon; tone?: 'amber' | 'emerald' | 'blue' | 'rose'; label: string }) {
  const tones = {
    amber: 'border-amber-300 bg-amber-50 text-amber-700 dark:border-amber-800 dark:bg-[#1f1f1f] dark:text-amber-300',
    emerald: 'border-emerald-300 bg-emerald-50 text-emerald-800 dark:border-emerald-800 dark:bg-[#1f1f1f] dark:text-emerald-300',
    blue: 'border-sky-300 bg-sky-50 text-sky-800 dark:border-sky-800 dark:bg-[#1f1f1f] dark:text-sky-300',
    rose: 'border-rose-300 bg-rose-50 text-rose-800 dark:border-rose-800 dark:bg-[#1f1f1f] dark:text-rose-300',
  };

  return (
    <span role="img" aria-label={label} className={`mx-auto mb-5 grid h-14 w-14 place-items-center rounded-full border shadow-[0_10px_25px_rgba(24,54,41,0.10)] ring-4 ring-white/70 dark:ring-[#131209]/70 sm:h-16 sm:w-16 ${tones[tone]}`}>
      <Icon className="h-6 w-6 animate-float-gentle sm:h-7 sm:w-7" aria-hidden="true" />
    </span>
  );
}
