'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader as Loader2 } from 'lucide-react';
import { useAdminAuth } from '@/lib/admin-auth-context';

export default function AdminGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAdminAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) router.replace('/admin/login');
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-zinc-50 flex items-center justify-center">
        <Loader2 className="w-6 h-6 text-zinc-400 animate-spin" />
      </div>
    );
  }

  return <>{children}</>;
}
