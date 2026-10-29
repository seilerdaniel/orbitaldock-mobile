import { useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { CheckCircle2, ClipboardCopy, FileText, Pencil } from 'lucide-react-native';

import { Project } from '@/src/types';
import { STATUS_LABELS, buildTandaPrompt } from '@/src/lib/prompt';
import { StatusBadge } from '@/src/components/Badge';
import { BottomSheet } from '@/src/components/BottomSheet';

interface SheetBaseProps {
  project: Project | null;
  onClose: () => void;
}

function Chip({ label }: { label: string }) {
  return (
    <View className="rounded-md border border-slate-700/50 bg-slate-900/60 px-2 py-1">
      <Text className="text-xs text-slate-300">{label}</Text>
    </View>
  );
}

/** Full tanda detail inside a native bottom sheet. */
export function TandaDetailSheet({
  project,
  onClose,
  onShowPrompt,
  onEdit,
}: SheetBaseProps & {
  onShowPrompt: (project: Project) => void;
  onEdit: (project: Project) => void;
}) {
  if (!project) return null;

  return (
    <BottomSheet
      visible={project !== null}
      onClose={onClose}
      title={project.name}
      subtitle={project.alias ?? undefined}
    >
      <ScrollView showsVerticalScrollIndicator={false} className="px-5 pt-4">
        <View className="flex-row items-start justify-between gap-3">
          <StatusBadge status={project.status} />
          <Chip label={`${STATUS_LABELS[project.status]} · ${project.day}`} />
        </View>

        <View className="mt-3 flex-row flex-wrap items-center gap-2">
          <Chip label={project.platform} />
          <Chip label={project.category} />
          <Chip label={`Declarado: ${project.tests || 'sin declarar'}`} />
        </View>

        <Text className="mt-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
          Descripción
        </Text>
        <Text className="mt-1.5 text-sm leading-5 text-slate-300">{project.description}</Text>

        {project.tasks.length > 0 ? (
          <>
            <Text className="mt-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
              Tareas pendientes ({project.tasks.length})
            </Text>
            <View className="mt-2 gap-2">
              {project.tasks.map((task, index) => (
                <View key={task} className="flex-row items-start gap-2 rounded-xl border border-slate-700/50 bg-slate-900/60 px-3 py-2.5">
                  <Text className="text-sm font-bold text-indigo-400">{index + 1}.</Text>
                  <Text className="flex-1 text-sm leading-5 text-slate-300">{task}</Text>
                </View>
              ))}
            </View>
          </>
        ) : null}
      </ScrollView>

      <View className="mt-4 flex-row gap-3 px-5 pt-2">
        <Pressable
          accessibilityRole="button"
          onPress={() => onEdit(project)}
          className="flex-1 flex-row items-center justify-center gap-2 rounded-xl border border-indigo-400/40 bg-indigo-500/15 px-4 py-3"
        >
          <Pencil size={18} color="#a5b4fc" />
          <Text className="text-sm font-semibold text-indigo-300">Editar</Text>
        </Pressable>
        <Pressable
          accessibilityRole="button"
          onPress={() => onShowPrompt(project)}
          className="flex-1 flex-row items-center justify-center gap-2 rounded-xl border border-slate-600/60 bg-slate-900/60 px-4 py-3"
        >
          <FileText size={18} color="#94a3b8" />
          <Text className="text-sm font-semibold text-slate-300">Ver Prompt</Text>
        </Pressable>
      </View>
    </BottomSheet>
  );
}

/** Tanda prompt preview (monospace) with copy action inside a bottom sheet. */
export function PromptSheet({ project, onClose }: SheetBaseProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!project) return;
    await Clipboard.setStringAsync(buildTandaPrompt(project));
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  if (!project) return null;

  return (
    <BottomSheet
      visible={project !== null}
      onClose={onClose}
      title="Prompt de Tanda"
      subtitle={`${project.name} · listo para pegar en OpenCode`}
    >
      <ScrollView showsVerticalScrollIndicator={false} className="px-5 pt-4">
        <View className="rounded-xl border border-slate-700/50 bg-slate-900 p-3">
          <Text selectable className="font-mono text-xs leading-5 text-slate-300">
            {buildTandaPrompt(project)}
          </Text>
        </View>
      </ScrollView>

      <View className="mt-4 px-5 pt-2">
        <Pressable
          accessibilityRole="button"
          onPress={handleCopy}
          className={`flex-row items-center justify-center gap-2 rounded-xl border px-4 py-3 ${
            copied ? 'border-emerald-500/40 bg-emerald-500/15' : 'border-indigo-400/40 bg-indigo-500/15'
          }`}
        >
          {copied ? (
            <>
              <CheckCircle2 size={18} color="#34d399" />
              <Text className="text-sm font-semibold text-emerald-300">¡Copiado!</Text>
            </>
          ) : (
            <>
              <ClipboardCopy size={18} color="#a5b4fc" />
              <Text className="text-sm font-semibold text-indigo-300">Copiar al portapapeles</Text>
            </>
          )}
        </Pressable>
      </View>
    </BottomSheet>
  );
}
