import '../global.css';

import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { ProjectsProvider } from '@/src/state/ProjectsContext';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <ProjectsProvider>
        <StatusBar style="light" />
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: '#0f172a' },
          }}
        />
      </ProjectsProvider>
    </SafeAreaProvider>
  );
}