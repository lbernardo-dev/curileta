import { DestinationsManager } from './DestinationsManager';
import { getDestinationData } from '@/lib/destinations.server';

export default async function DestinationsAdminPage() {
  const initialData = await getDestinationData('es', true);
  return <DestinationsManager initialData={{ success: true, ...initialData }} />;
}
