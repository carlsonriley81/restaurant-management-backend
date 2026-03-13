'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';
import type { UserRole } from '@/types/auth';

/**
 * Redirect to login if the user is not authenticated or lacks required role.
 */
export function useRoleGuard(allowedRoles?: UserRole[]) {
  const { user, isAuthenticated } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace('/login');
      return;
    }

    if (allowedRoles && user && !allowedRoles.includes(user.role)) {
      router.replace('/');
    }
  }, [isAuthenticated, user, allowedRoles, router]);

  return { user, isAuthenticated };
}
