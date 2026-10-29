import { Text, TouchableOpacity, View } from 'react-native';
import { Orbit, Plus } from 'lucide-react-native';

interface EmptyPortfolioProps {
  onCreate: () => void;
}

/** Welcome screen shown while the portfolio has no projects at all. */
export function EmptyPortfolio({ onCreate }: EmptyPortfolioProps) {
  return (
    <View className="flex-1 items-center justify-center px-6 py-10">
      <View className="rounded-3xl border border-indigo-400/30 bg-indigo-500/10 p-6">
        <Orbit size={44} color="#818cf8" />
      </View>

      <Text className="mt-6 text-center text-xl font-extrabold text-slate-100">
        Tu portafolio está vacío
      </Text>
      <Text className="mt-2 max-w-sm text-center text-sm leading-6 text-slate-400">
        Creá tu primer proyecto para trackear tandas de trabajo, agenda semanal, costos mensuales y
        el estado de tus tests en un solo lugar.
      </Text>

      <TouchableOpacity
        accessibilityRole="button"
        accessibilityLabel="Crear proyecto"
        onPress={onCreate}
        className="mt-7 flex-row items-center gap-2 rounded-2xl bg-indigo-500 px-7 py-4"
      >
        <Plus size={20} color="#ffffff" />
        <Text className="text-base font-bold text-white">Crear Proyecto</Text>
      </TouchableOpacity>

      <Text className="mt-5 text-center text-xs leading-5 text-slate-500">
        También podés importar un backup JSON desde Configuración.
      </Text>
    </View>
  );
}
