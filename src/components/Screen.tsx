import { SafeAreaView } from 'react-native-safe-area-context';
import { PropsWithChildren } from 'react';

/** Dark OrbitalDock screen wrapper: slate-900 background with safe area. */
export function Screen({ children }: PropsWithChildren) {
  return <SafeAreaView edges={['top']} className="flex-1 bg-slate-900">{children}</SafeAreaView>;
}