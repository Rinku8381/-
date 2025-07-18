'use client';

import { useRouter } from 'next/navigation';
import TermsScreen from './TermsScreen';
import PageTransition from '@/components/PageTransition';

export default function TermsPage() {
  const router = useRouter();

  return (
    <PageTransition>
      <TermsScreen
        isVisible={true}
        onAccept={() => router.push('/login')}
        onDecline={() => router.push('/splash')}
      />
    </PageTransition>
  );
}
