import '../global.css';

import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { ProjectsProvider } from '@/src/state/ProjectsContext';
import { BusProvider } from '@/src/state/BusContext';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <BusProvider>
        <ProjectsProvider>
          <StatusBar style="light" />
          <Stack
            screenOptions={{
              headerShown: false,
              contentStyle: { backgroundColor: '#0f172a' },
            }}
          />
        </ProjectsProvider>
      </BusProvider>
    </SafeAreaProvider>
  );
}
