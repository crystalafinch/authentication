import { ReactNode } from 'react';
import AuthProvider from '../../context/AuthContext';
import AriaAnnouncerProvider from '../../components/aria-announcer/AriaAnnouncer';

export default function AppProviders({ children }: { children: ReactNode }) {
  return (
    <AriaAnnouncerProvider>
      <AuthProvider>{children}</AuthProvider>
    </AriaAnnouncerProvider>
  );
}
