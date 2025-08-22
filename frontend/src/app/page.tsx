'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();
  
  // Redirect to dashboard page
  useEffect(() => {
    router.push('/dashboard');
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">Redirecting to Dashboard</h1>
        <p className="text-slate-500 dark:text-slate-400">Please wait...</p>
      </div>
    </div>
  );
}
