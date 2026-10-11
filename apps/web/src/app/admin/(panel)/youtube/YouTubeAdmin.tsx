'use client';

import { useState } from 'react';
import { YouTubeChannelEditor } from './YouTubeChannelEditor';
import { YouTubeContentManager } from './YouTubeContentManager';

type Section = 'content' | 'channel';

export function YouTubeAdmin() {
  const [section, setSection] = useState<Section>('content');

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <nav aria-label="Secciones de YouTube" className="flex flex-wrap gap-2 border-b border-slate-200 pb-3 dark:border-[#313131]">
        {([
          ['content', 'Vídeos y música'],
          ['channel', 'Identidad del canal'],
        ] as const).map(([value, label]) => (
          <button
            key={value}
            type="button"
            aria-current={section === value ? 'page' : undefined}
            onClick={() => setSection(value)}
            className={`rounded-lg px-4 py-2 text-sm font-semibold transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 ${section === value ? 'bg-emerald-100 text-emerald-950 dark:bg-[#272727] dark:text-emerald-200' : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-[#272727]'}`}
          >
            {label}
          </button>
        ))}
      </nav>
      {section === 'content' ? <YouTubeContentManager /> : <YouTubeChannelEditor />}
    </div>
  );
}
