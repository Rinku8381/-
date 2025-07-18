'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import OnboardingStep1 from '@/components/OnboardingStep1';
import PageTransition from '@/components/PageTransition';
import useAuthGuard from '@/utils/useAuthGuard';

export default function Step1Page() {
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
      <OnboardingStep1
        onNext={() => router.push('/onboarding/step2')}
        onSkip={() => router.push('/dashboard')}
      />
    </PageTransition>
  );
}

