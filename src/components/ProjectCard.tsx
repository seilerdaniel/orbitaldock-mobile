import { Text, TouchableOpacity, View } from 'react-native';
import { ClipboardCopy } from 'lucide-react-native';

import { Project } from '@/src/types';
import { StatusBadge } from '@/src/components/Badge';

interface ProjectCardProps {
  project: Project;
  showTasks?: boolean;
  onPress?: (project: Project) => void;
  onCopyPrompt?: (project: Project) => void;
}

export function ProjectCard({ project, showTasks = false, onPress, onCopyPrompt }: ProjectCardProps) {
  return (
    <TouchableOpacity
      activeOpacity={onPress ? 0.7 : 1}
      onPress={onPress ? () => onPress(project) : undefined}
      disabled={!onPress}
      accessibilityRole={onPress ? 'button' : undefined}
      className="rounded-2xl border border-slate-700/50 bg-slate-800 p-4"
    >
      <View className="flex-row items-start justify-between gap-3">
        <View className="flex-1">
          <Text className="text-base font-bold text-slate-100">{project.name}</Text>
          {project.alias ? <Text className="mt-0.5 text-xs text-slate-400">{project.alias}</Text> : null}
        </View>
        <StatusBadge status={project.status} />
      </View>

      <View className="mt-3 flex-row flex-wrap items-center gap-2">
        <View className="rounded-md border border-slate-700/50 bg-slate-900/60 px-2 py-1">
          <Text className="text-xs text-slate-300">{project.platform}</Text>
        </View>
        <View className="rounded-md border border-slate-700/50 bg-slate-900/60 px-2 py-1">
          <Text className="text-xs text-slate-300">{project.category}</Text>
        </View>
        <View className="rounded-md border border-slate-700/50 bg-slate-900/60 px-2 py-1">
          <Text className="text-xs text-slate-300">Tests: {project.tests}</Text>
        </View>
        <View className="rounded-md border border-slate-700/50 bg-slate-900/60 px-2 py-1">
          <Text className="text-xs text-slate-300">Día: {project.day}</Text>
        </View>
      </View>

      <Text className="mt-3 text-sm leading-5 text-slate-400">{project.description}</Text>

      {showTasks && project.tasks.length > 0 ? (
        <View className="mt-3">
          <Text className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Tareas pendientes ({project.tasks.length})
          </Text>
          {project.tasks.map((task) => (
            <Text key={task} className="mt-1 text-sm text-slate-300">
              • {task}
            </Text>
          ))}
        </View>
      ) : null}

      {onCopyPrompt ? (
        <TouchableOpacity
          accessibilityRole="button"
          onPress={() => onCopyPrompt(project)}
          className="mt-4 flex-row items-center justify-center gap-2 rounded-xl border border-indigo-400/40 bg-indigo-500/15 px-4 py-2.5"
        >
          <ClipboardCopy size={16} color="#a5b4fc" />
          <Text className="text-sm font-semibold text-indigo-300">Copiar Prompt de Tanda</Text>
        </TouchableOpacity>
      ) : null}
    </TouchableOpacity>
  );
}
