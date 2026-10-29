import { useMemo, useState } from 'react';
import { ActivityIndicator, FlatList, Text, View } from 'react-native';

import { Screen } from '@/src/components/Screen';
import { DaySelector } from '@/src/components/DaySelector';
import { EmptyPortfolio } from '@/src/components/EmptyPortfolio';
import { Fab } from '@/src/components/Fab';
import { ProjectCard } from '@/src/components/ProjectCard';
import { PromptSheet, TandaDetailSheet } from '@/src/components/TandaSheets';
import { useProjectEditor } from '@/src/state/ProjectEditorContext';
import { useProjects } from '@/src/state/ProjectsContext';
import { usePullToRefresh } from '@/src/lib/usePullToRefresh';
import { todayWeekDay } from '@/src/lib/date';
import { Project, WeekDay } from '@/src/types';

export default function AgendaScreen() {
  const { projects, loading } = useProjects();
  const { openNew, openEdit } = useProjectEditor();
  const [selectedDay, setSelectedDay] = useState<WeekDay>(todayWeekDay);
  const [detailProject, setDetailProject] = useState<Project | null>(null);
  const [promptProject, setPromptProject] = useState<Project | null>(null);

  const dayProjects = useMemo(
    () => projects.filter((project) => project.day === selectedDay),
    [projects, selectedDay],
  );

  const { refreshControl } = usePullToRefresh();

  if (loading) {
    return (
      <Screen>
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator color="#818cf8" />
        </View>
      </Screen>
    );
  }

  if (projects.length === 0) {
    return (
      <Screen>
        <View className="px-4 pt-2">
          <Text className="text-2xl font-extrabold text-slate-100">Agenda Hoy</Text>
          <Text className="mt-1 text-sm text-slate-400">
            Tu portafolio empieza con el primer proyecto.
          </Text>
        </View>
        <EmptyPortfolio onCreate={openNew} />
      </Screen>
    );
  }

  return (
    <Screen>
      <View className="px-4 pt-2">
        <Text className="text-2xl font-extrabold text-slate-100">Agenda Hoy</Text>
        <Text className="mt-1 text-sm text-slate-400">
          {dayProjects.length > 0
            ? `${dayProjects.length} ${dayProjects.length === 1 ? 'proyecto asignado' : 'proyectos asignados'} para el día ${selectedDay}`
            : `Sin proyectos asignados para el día ${selectedDay}`}
        </Text>
        <View className="mt-4">
          <DaySelector selected={selectedDay} onSelect={setSelectedDay} />
        </View>
      </View>

      <FlatList
        data={dayProjects}
        keyExtractor={(item) => item.id}
        contentContainerClassName="gap-3 px-4 pb-24 pt-4"
        showsVerticalScrollIndicator={false}
        refreshControl={refreshControl}
        renderItem={({ item }) => (
          <ProjectCard
            project={item}
            onPress={setDetailProject}
            onCopyPrompt={(project) => setPromptProject(project)}
          />
        )}
        ListEmptyComponent={
          <View className="mt-10 items-center rounded-2xl border border-slate-700/50 bg-slate-800 p-6">
            <Text className="text-center text-sm text-slate-400">
              No hay proyectos asignados a este día. Tocá + para crear uno o elegí otro día.
            </Text>
          </View>
        }
      />

      <Fab onPress={openNew} />

      <TandaDetailSheet
        project={detailProject}
        onClose={() => setDetailProject(null)}
        onEdit={(project) => {
          setDetailProject(null);
          openEdit(project);
        }}
        onShowPrompt={(project) => {
          setDetailProject(null);
          setPromptProject(project);
        }}
      />
      <PromptSheet project={promptProject} onClose={() => setPromptProject(null)} />
    </Screen>
  );
}
