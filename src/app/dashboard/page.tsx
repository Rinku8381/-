// src/app/dashboard/page.tsx

'use client';

import { useRouter } from 'next/navigation';
import Dashboard from '@/components/Dashboard';
import PageTransition from '@/components/PageTransition';
import useAuthGuard from '@/utils/useAuthGuard';

export default function DashboardPage() {
  const router = useRouter();

  // Auth guard hook must be called inside the component
  useAuthGuard();

  return (
    <PageTransition>
      <Dashboard onLogout={() => router.push('/login')} />
    </PageTransition>
  );
}
