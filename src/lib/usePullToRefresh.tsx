import { useCallback, useState } from 'react';
import { RefreshControl } from 'react-native';

import { useBus } from '@/src/state/BusContext';

interface BusRefreshOptions {
  /** Extra work to run alongside the bus refresh (e.g. re-fetch FX rate). */
  task?: () => Promise<void>;
}

/**
 * Pull-to-refresh wiring for FlatList / ScrollView: forces a fresh bus
 * connection (and any extra async task) while showing the native spinner.
 */
export function usePullToRefresh({ task }: BusRefreshOptions = {}) {
  const { refresh } = useBus();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      refresh();
      await Promise.all([task?.(), new Promise((resolve) => setTimeout(resolve, 700))]);
    } finally {
      setRefreshing(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refresh, task]);

  return {
    refreshing,
    onRefresh,
    refreshControl: (
      <RefreshControl
        refreshing={refreshing}
        onRefresh={onRefresh}
        tintColor="#818cf8"
        titleColor="#818cf8"
        colors={['#818cf8']}
        progressBackgroundColor="#1e293b"
      />
    ),
  };
}
