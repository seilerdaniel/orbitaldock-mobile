import { TouchableOpacity } from 'react-native';
import { Plus } from 'lucide-react-native';

interface FabProps {
  onPress: () => void;
  label?: string;
}

/** Floating action button used by Agenda and Proyectos to create a project. */
export function Fab({ onPress, label = 'Nuevo proyecto' }: FabProps) {
  return (
    <TouchableOpacity
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      className="absolute bottom-6 right-5 z-20 h-14 w-14 items-center justify-center rounded-full border border-indigo-300/40 bg-indigo-500"
    >
      <Plus size={26} color="#ffffff" />
    </TouchableOpacity>
  );
}
