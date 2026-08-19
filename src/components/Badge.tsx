import { Text, View } from 'react-native';

import { ProjectStatus } from '@/src/types';
import { STATUS_LABELS } from '@/src/lib/prompt';

const STATUS_STYLES: Record<ProjectStatus, { badge: string; dot: string }> = {
  produccion: { badge: 'bg-emerald-500/15 border-emerald-500/40', dot: 'bg-emerald-500' },
  desarrollo: { badge: 'bg-blue-500/15 border-blue-500/40', dot: 'bg-blue-500' },
  pausa: { badge: 'bg-amber-500/15 border-amber-500/40', dot: 'bg-amber-500' },
  mantenimiento: { badge: 'bg-red-500/15 border-red-500/40', dot: 'bg-red-500' },
};

export function StatusBadge({ status }: { status: ProjectStatus }) {
  const styles = STATUS_STYLES[status];
  return (
    <View className={`flex-row items-center gap-1.5 rounded-full border px-2.5 py-1 ${styles.badge}`}>
      <View className={`h-2 w-2 rounded-full ${styles.dot}`} />
      <Text className="text-xs font-medium text-slate-200">{STATUS_LABELS[status]}</Text>
    </View>
  );
}