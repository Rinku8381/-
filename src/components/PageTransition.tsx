// ✨ Transisi Halaman dengan Framer Motion (Global Setup)

// 1. Install Framer Motion (jika belum):
// npm install framer-motion

// 2. Buat komponen wrapper: src/components/PageTransition.tsx

'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { ReactNode } from 'react';

export default function PageTransition({ children }: { children: ReactNode }) {
  const path = usePathname();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={path}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.4 }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
// 3. Gunakan komponen ini di layout utama: src/app/layout.tsx