import { Redirect } from 'expo-router';
import { useAppStore } from '@/store/useAppStore';
import React from 'react';

export default function Index() {
  const { hasSeenOnboarding, isAuthenticated } = useAppStore();

  if (!hasSeenOnboarding) {
    return <Redirect href="/onboarding" />;
  }

  if (!isAuthenticated) {
    return <Redirect href="/(auth)/welcome" />;
  }

  return <Redirect href="/(tabs)" />;
}
