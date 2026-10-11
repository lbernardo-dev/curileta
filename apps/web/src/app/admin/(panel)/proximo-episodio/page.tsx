import type { Metadata } from 'next';
import { UpcomingEpisodeEditor } from './UpcomingEpisodeEditor';

export const metadata: Metadata = {
  title: 'Personajes del próximo episodio',
  robots: { index: false, follow: false },
};

export default function UpcomingEpisodePage() {
  return <UpcomingEpisodeEditor />;
}
