'use client';

import dynamic from 'next/dynamic';

// Load SplashScreen component dynamically (optional but helps with SSR)
const SplashScreen = dynamic(() => import('@/components/SplashScreen'), {
  ssr: false, // Optional: disable SSR if animation/audio needs full browser env
});

const SplashPage = () => {
  return <SplashScreen />;
};

export default SplashPage;
// and includes any necessary styles or assets for the splash screen to function correctly.