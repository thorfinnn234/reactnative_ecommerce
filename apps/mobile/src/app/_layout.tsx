import '../global.css';

import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

// Phase 1 placeholder: a single stack. Tabs + auth screens arrive in Phase 5.
export default function RootLayout() {
  return (
    <>
      <Stack screenOptions={{ headerShown: false }} />
      <StatusBar style="auto" />
    </>
  );
}
