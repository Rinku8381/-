'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import OnboardingStep2 from '@/components/OnboardingStep2';
import PageTransition from '@/components/PageTransition';
import useAuthGuard from '@/utils/useAuthGuard';

export default function Step2Page() {
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
      <OnboardingStep2
        onNext={() => router.push('/onboarding/step3')}
        onBack={() => router.push('/onboarding/step1')}
        onSkip={() => router.push('/dashboard')}
      />
    </PageTransition>
  );
}

