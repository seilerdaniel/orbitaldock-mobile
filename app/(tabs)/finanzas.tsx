import { useMemo } from 'react';
import { FlatList, Text, View } from 'react-native';
import { ArrowDownRight, ArrowUpRight, DollarSign } from 'lucide-react-native';

import { Screen } from '@/src/components/Screen';
import { useProjects } from '@/src/state/ProjectsContext';
import { Project } from '@/src/types';

const formatUSD = (value: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);

const formatARS = (value: number) =>
  new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(value);

function CostRow({ project }: { project: Project }) {
  return (
    <View className="rounded-2xl border border-slate-700/50 bg-slate-800 p-4">
      <View className="flex-row items-center justify-between">
        <Text className="text-sm font-semibold text-slate-100">{project.name}</Text>
        <View className="flex-row items-center gap-2">
          {project.costs.usd > 0 ? (
            <View className="flex-row items-center gap-1 rounded-md border border-slate-700/50 bg-slate-900/60 px-2 py-1">
              <ArrowUpRight size={12} color="#34d399" />
              <Text className="text-xs text-emerald-400">{formatUSD(project.costs.usd)}</Text>
            </View>
          ) : null}
          {project.costs.ars > 0 ? (
            <View className="flex-row items-center gap-1 rounded-md border border-slate-700/50 bg-slate-900/60 px-2 py-1">
              <ArrowUpRight size={12} color="#fbbf24" />
              <Text className="text-xs text-amber-400">{formatARS(project.costs.ars)}</Text>
            </View>
          ) : null}
          {project.costs.usd === 0 && project.costs.ars === 0 ? (
            <Text className="text-xs text-slate-500">Sin costos</Text>
          ) : null}
        </View>
      </View>
    </View>
  );
}

export default function FinanzasScreen() {
  const { projects } = useProjects();

  const { totalUsd, totalArs, withCosts } = useMemo(() => {
    const totalUsd = projects.reduce((acc, p) => acc + p.costs.usd, 0);
    const totalArs = projects.reduce((acc, p) => acc + p.costs.ars, 0);
    return { totalUsd, totalArs, withCosts: projects.filter((p) => p.costs.usd > 0 || p.costs.ars > 0) };
  }, [projects]);

  return (
    <Screen>
      <View className="px-4 pt-2">
        <Text className="text-2xl font-extrabold text-slate-100">Finanzas</Text>
        <Text className="mt-1 text-sm text-slate-400">Resumen de costos mensuales del portafolio</Text>

        <View className="mt-4 flex-row gap-3">
          <View className="flex-1 rounded-2xl border border-slate-700/50 bg-slate-800 p-4">
            <View className="flex-row items-center gap-2">
              <DollarSign size={16} color="#34d399" />
              <Text className="text-xs font-medium uppercase tracking-wide text-slate-400">USD</Text>
            </View>
            <Text className="mt-2 text-2xl font-extrabold text-emerald-400">{formatUSD(totalUsd)}</Text>
            <Text className="mt-1 text-xs text-slate-500">por mes</Text>
          </View>
          <View className="flex-1 rounded-2xl border border-slate-700/50 bg-slate-800 p-4">
            <View className="flex-row items-center gap-2">
              <DollarSign size={16} color="#fbbf24" />
              <Text className="text-xs font-medium uppercase tracking-wide text-slate-400">ARS</Text>
            </View>
            <Text className="mt-2 text-2xl font-extrabold text-amber-400">{formatARS(totalArs)}</Text>
            <Text className="mt-1 text-xs text-slate-500">por mes</Text>
          </View>
        </View>

        <View className="mt-4 flex-row items-center gap-2 rounded-xl border border-slate-700/50 bg-slate-900/60 px-3 py-2.5">
          <ArrowDownRight size={16} color="#64748b" />
          <Text className="text-sm text-slate-400">
            {withCosts.length} proyectos con costos asociados
          </Text>
        </View>
      </View>

      <FlatList
        data={withCosts}
        keyExtractor={(item) => item.id}
        contentContainerClassName="gap-3 px-4 pb-8 pt-4"
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => <CostRow project={item} />}
        ListEmptyComponent={
          <View className="mt-10 items-center rounded-2xl border border-slate-700/50 bg-slate-800 p-6">
            <Text className="text-sm text-slate-400">No hay costos registrados para este mes.</Text>
          </View>
        }
      />
    </Screen>
  );
}