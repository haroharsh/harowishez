'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export function HashRouterListener() {
  const router = useRouter();

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash && hash.length > 1) {
        // Strip leading #/ or #
        const cleanHash = hash.replace(/^#\/?/, '').trim();
        if (cleanHash && !cleanHash.startsWith('admin')) {
          console.log('⚡ Hash route detected:', cleanHash);
          router.push(`/wishes/${cleanHash}`);
        }
      }
    };

    // Check hash on initial mount
    handleHashChange();

    // Listen for hash change events
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [router]);

  return null;
}
