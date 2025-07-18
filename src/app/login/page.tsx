'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import LoginScreen from '@/components/LoginScreen';
import PageTransition from '@/components/PageTransition';
import { loginUser, isAuthenticated } from '@/utils/auth';

export default function LoginPage() {
  const router = useRouter();
  const path = usePathname();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (isAuthenticated()) {
      router.push('/dashboard');
    }
  }, []);

  const handleLogin = () => {
    const success = loginUser(username, password);
    if (success) {
      router.push('/onboarding/step1');
    } else {
      setError('Invalid credentials');
    }
  };

  return (
    <motion.div
      key={path}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
    >
      <PageTransition>
        <LoginScreen onLoginSuccess={handleLogin} />
      </PageTransition>
    </motion.div>
  );
}