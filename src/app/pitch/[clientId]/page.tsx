import { PitchBuilder } from '@/components/PitchBuilder';

export default async function Page({ params }: { params: Promise<{ clientId: string }> }) {
  const { clientId } = await params;
  return <PitchBuilder initialClientId={clientId} />;
}
