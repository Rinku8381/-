// src/app/dashboard/page.tsx

'use client';

import { useRouter } from 'next/navigation';
import Dashboard from '@/components/Dashboard';
import PageTransition from '@/components/PageTransition'; // ini yang penting 🦋
import useAuthGuard from '@/utils/useAuthGuard';

export default function DashboardPage() {
  const router = useRouter();

  return (
    <PageTransition>
      <Dashboard onLogout={() => router.push('/login')} />
    </PageTransition>
  );
}
// src/app/dashboard/page.tsx
// 1. Buat halaman untuk dashboard: src/app/dashboard/page.tsx
useAuthGuard();
// src/app/dashboard/page.tsx