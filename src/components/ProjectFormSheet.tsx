import { ReactNode, useState } from 'react';
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { Trash2 } from 'lucide-react-native';

import { BottomSheet } from '@/src/components/BottomSheet';
import { normalizeProject } from '@/src/lib/normalize';
import { STATUS_LABELS } from '@/src/lib/prompt';
import {
  PROJECT_CATEGORIES,
  PROJECT_PLATFORMS,
  PROJECT_STATUSES,
  Project,
  WEEK_DAYS,
} from '@/src/types';

interface ProjectFormSheetProps {
  project: Project;
  isNew: boolean;
  onClose: () => void;
  onSave: (project: Project) => void;
  onDelete: (id: string) => void;
}

const INPUT_CLASS =
  'rounded-xl border border-slate-700/60 bg-slate-900/60 px-3 py-2.5 text-sm text-slate-100';

const parseAmount = (text: string): number => {
  const value = Number(text.replace(',', '.'));
  return Number.isFinite(value) && value > 0 ? value : 0;
};

/** Create/edit form for a project. Delete asks for confirmation inline (works on web too). */
export function ProjectFormSheet({ project, isNew, onClose, onSave, onDelete }: ProjectFormSheetProps) {
  const [draft, setDraft] = useState<Project>(project);
  const [tasksText, setTasksText] = useState(project.tasks.join('\n'));
  const [usdText, setUsdText] = useState(project.costs.usd > 0 ? String(project.costs.usd) : '');
  const [arsText, setArsText] = useState(project.costs.ars > 0 ? String(project.costs.ars) : '');
  const [confirmDelete, setConfirmDelete] = useState(false);

  const patch = (value: Partial<Project>) => setDraft((current) => ({ ...current, ...value }));

  const canSave = draft.name.trim().length > 0;

  const handleSave = () => {
    if (!canSave) return;
    onSave(
      normalizeProject({
        ...draft,
        name: draft.name.trim(),
        tasks: tasksText
          .split('\n')
          .map((task) => task.trim())
          .filter(Boolean),
        costs: { usd: parseAmount(usdText), ars: parseAmount(arsText) },
      }),
    );
  };

  return (
    <BottomSheet
      visible
      onClose={onClose}
      title={isNew ? 'Nuevo proyecto' : 'Editar proyecto'}
      subtitle={isNew ? 'Cargá lo básico y guardá; después podés completar el resto.' : draft.name}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        className="px-5 pt-4"
        contentContainerClassName="gap-4 pb-3"
      >
        <Field label="Nombre *">
          <TextInput
            value={draft.name}
            onChangeText={(name) => patch({ name })}
            placeholder="Nombre del proyecto"
            placeholderTextColor="#64748b"
            className={INPUT_CLASS}
            autoFocus={isNew}
          />
        </Field>

        <Field label="Alias">
          <TextInput
            value={draft.alias ?? ''}
            onChangeText={(alias) => patch({ alias })}
            placeholder="Opcional"
            placeholderTextColor="#64748b"
            className={INPUT_CLASS}
          />
        </Field>

        <Field label="Plataforma">
          <View className="flex-row flex-wrap gap-2">
            {PROJECT_PLATFORMS.map((platform) => (
              <ChoiceChip
                key={platform}
                label={platform}
                selected={draft.platform === platform}
                onPress={() => patch({ platform })}
              />
            ))}
          </View>
        </Field>

        <Field label="Categoría">
          <View className="flex-row flex-wrap gap-2">
            {PROJECT_CATEGORIES.map((category) => (
              <ChoiceChip
                key={category}
                label={category}
                selected={draft.category === category}
                onPress={() => patch({ category })}
              />
            ))}
          </View>
        </Field>

        <Field label="Estado">
          <View className="flex-row flex-wrap gap-2">
            {PROJECT_STATUSES.map((status) => (
              <ChoiceChip
                key={status}
                label={STATUS_LABELS[status]}
                selected={draft.status === status}
                onPress={() => patch({ status })}
              />
            ))}
          </View>
        </Field>

        <Field label="Día de tanda">
          <View className="flex-row flex-wrap gap-2">
            {WEEK_DAYS.map((day) => (
              <ChoiceChip
                key={day}
                label={day}
                selected={draft.day === day}
                onPress={() => patch({ day })}
              />
            ))}
          </View>
        </Field>

        <Field label="Tests declarados" hint="El resultado que declarás vos: la app no ejecuta tests.">
          <TextInput
            value={draft.tests}
            onChangeText={(tests) => patch({ tests })}
            placeholder="Ej: 12/12"
            placeholderTextColor="#64748b"
            className={INPUT_CLASS}
            autoCapitalize="none"
          />
        </Field>

        <Field label="Descripción">
          <TextInput
            value={draft.description}
            onChangeText={(description) => patch({ description })}
            placeholder="De qué se trata el proyecto"
            placeholderTextColor="#64748b"
            className={`${INPUT_CLASS} h-24`}
            multiline
            textAlignVertical="top"
          />
        </Field>

        <Field label="Tareas pendientes" hint="Una tarea por línea.">
          <TextInput
            value={tasksText}
            onChangeText={setTasksText}
            placeholder={'Revisar deploy\nActualizar dependencias'}
            placeholderTextColor="#64748b"
            className={`${INPUT_CLASS} h-24`}
            multiline
            textAlignVertical="top"
          />
        </Field>

        <Field label="Costos mensuales">
          <View className="flex-row gap-3">
            <TextInput
              value={usdText}
              onChangeText={setUsdText}
              placeholder="USD"
              placeholderTextColor="#64748b"
              className={`${INPUT_CLASS} flex-1`}
              keyboardType="numeric"
            />
            <TextInput
              value={arsText}
              onChangeText={setArsText}
              placeholder="ARS"
              placeholderTextColor="#64748b"
              className={`${INPUT_CLASS} flex-1`}
              keyboardType="numeric"
            />
          </View>
        </Field>
      </ScrollView>

      <View className="gap-3 px-5 pt-2">
        <View className="flex-row gap-3">
          <Pressable
            accessibilityRole="button"
            onPress={onClose}
            className="flex-1 items-center rounded-xl border border-slate-600/60 bg-slate-900/60 px-4 py-3"
          >
            <Text className="text-sm font-semibold text-slate-300">Cancelar</Text>
          </Pressable>
          <Pressable
            accessibilityRole="button"
            accessibilityState={{ disabled: !canSave }}
            disabled={!canSave}
            onPress={handleSave}
            className={`flex-1 items-center rounded-xl px-4 py-3 ${
              canSave ? 'bg-indigo-500' : 'bg-slate-700'
            }`}
          >
            <Text className={`text-sm font-bold ${canSave ? 'text-white' : 'text-slate-400'}`}>
              Guardar
            </Text>
          </Pressable>
        </View>

        {!isNew ? (
          confirmDelete ? (
            <View className="rounded-xl border border-red-500/40 bg-red-500/10 p-3">
              <Text className="text-sm leading-5 text-red-200">
                ¿Eliminar «{draft.name}»? Esta acción no se puede deshacer.
              </Text>
              <View className="mt-3 flex-row gap-3">
                <Pressable
                  accessibilityRole="button"
                  onPress={() => setConfirmDelete(false)}
                  className="flex-1 items-center rounded-xl border border-slate-600/60 bg-slate-900/60 px-3 py-2.5"
                >
                  <Text className="text-sm font-semibold text-slate-300">Cancelar</Text>
                </Pressable>
                <Pressable
                  accessibilityRole="button"
                  onPress={() => onDelete(draft.id)}
                  className="flex-1 items-center rounded-xl bg-red-500 px-3 py-2.5"
                >
                  <Text className="text-sm font-bold text-white">Eliminar</Text>
                </Pressable>
              </View>
            </View>
          ) : (
            <Pressable
              accessibilityRole="button"
              onPress={() => setConfirmDelete(true)}
              className="flex-row items-center justify-center gap-2 rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-2.5"
            >
              <Trash2 size={16} color="#f87171" />
              <Text className="text-sm font-semibold text-red-300">Eliminar proyecto</Text>
            </Pressable>
          )
        ) : null}
      </View>
    </BottomSheet>
  );
}

function Field({ label, hint, children }: { label: string; hint?: string; children: ReactNode }) {
  return (
    <View className="gap-1.5">
      <Text className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</Text>
      {children}
      {hint ? <Text className="text-xs text-slate-500">{hint}</Text> : null}
    </View>
  );
}

function ChoiceChip({
  label,
  selected,
  onPress,
}: {
  label: string;
  selected: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected }}
      onPress={onPress}
      className={`rounded-full border px-3.5 py-1.5 ${
        selected ? 'border-indigo-400 bg-indigo-500' : 'border-slate-700/60 bg-slate-900/60'
      }`}
    >
      <Text className={`text-xs font-semibold ${selected ? 'text-white' : 'text-slate-300'}`}>
        {label}
      </Text>
    </Pressable>
  );
}
