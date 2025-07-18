'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import OnboardingStep3 from '@/components/OnboardingStep3';
import PageTransition from '@/components/PageTransition';
import useAuthGuard from '@/utils/useAuthGuard';

export default function Step3Page() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    useAuthGuard();
    setIsAuthenticated(true);
  }, []);

  if (!isAuthenticated) {
    return null;
  }

  return (
    <PageTransition>
      <OnboardingStep3
        onNext={() => router.push('/onboarding/welcome')}
        onBack={() => router.push('/onboarding/step2')}
      />
    </PageTransition>
  );
}
