'use client';

import { NotificationProvider } from '@/components/notifications/notification-provider';

export function AppProviders({ children }: { children: React.ReactNode }) {
  return <NotificationProvider>{children}</NotificationProvider>;
}
