import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from 'react';

import { BusSnapshot, OrbitalBusClient } from '@/src/lib/bus';

const DEFAULT_BUS_URL = 'ws://localhost:4000/ws';
const busUrl = process.env.EXPO_PUBLIC_ORBITAL_BUS_URL ?? DEFAULT_BUS_URL;

interface BusContextValue {
  snapshot: BusSnapshot;
  refresh: () => void;
}

const BusContext = createContext<BusContextValue | undefined>(undefined);

export function BusProvider({ children }: { children: ReactNode }) {
  const client = useMemo(() => new OrbitalBusClient(busUrl), []);
  const [snapshot, setSnapshot] = useState<BusSnapshot>(() => client.getSnapshot());

  useEffect(() => {
    setSnapshot(client.getSnapshot());
    const unsubscribe = client.subscribe(setSnapshot);
    client.start();
    return () => {
      unsubscribe();
      client.stop();
    };
  }, [client]);

  const value = useMemo(() => ({ snapshot, refresh: () => client.refresh() }), [client, snapshot]);

  return <BusContext.Provider value={value}>{children}</BusContext.Provider>;
}

export function useBus(): BusContextValue {
  const ctx = useContext(BusContext);
  if (!ctx) {
    throw new Error('useBus must be used inside <BusProvider>');
  }
  return ctx;
}
