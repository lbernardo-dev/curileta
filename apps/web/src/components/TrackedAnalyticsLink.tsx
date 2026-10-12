'use client';

import type { ReactNode } from 'react';
import { analytics } from '@curileta/analytics';

type TrackedAction =
  | { name: 'song_play'; id: string; label: string }
  | { name: 'book_purchase_click'; id: string; label: string };

interface TrackedAnalyticsLinkProps {
  href: string;
  action: TrackedAction;
  children: ReactNode;
  className?: string;
  target?: string;
}

export function TrackedAnalyticsLink({ href, action, children, className, target }: TrackedAnalyticsLinkProps) {
  function track() {
    if (action.name === 'song_play') {
      analytics.track({ name: 'song_play', properties: { songId: action.id, title: action.label } });
    } else {
      analytics.track({ name: 'book_purchase_click', properties: { bookId: action.id, storeName: action.label } });
    }
  }

  const isYouTubeLink = href.startsWith('https://www.youtube.com/');
  return <a href={href} target={target} rel={target === '_blank' ? (isYouTubeLink ? 'noopener' : 'noopener noreferrer') : undefined} onClick={track} className={className}>{children}</a>;
}
