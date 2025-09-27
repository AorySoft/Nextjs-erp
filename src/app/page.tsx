'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { isSessionValid } from '@/lib/auth';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Check if user is authenticated
    if (!isSessionValid()) {
      router.replace('/login');
    } else {
      // Check if entity is selected
      const selectedEntity = localStorage.getItem('selectedEntity') || sessionStorage.getItem('selectedEntity');
      if (!selectedEntity) {
        router.replace('/entity-selection');
      } else {
        router.replace('/human-resource');
      }
    }
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-600">Loading...</p>
      </div>
    </div>
  );
}
