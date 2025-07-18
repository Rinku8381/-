'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import WelcomeComplete from '@/components/WelcomeComplete';
import PageTransition from '@/components/PageTransition';
import useAuthGuard from '@/utils/useAuthGuard';

export default function WelcomePage() {
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
      <WelcomeComplete
        onToDashboard={() => router.push('/dashboard')}
      />
    </PageTransition>
  );
}

useAuthGuard();