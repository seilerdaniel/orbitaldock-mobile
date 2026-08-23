import { useMemo, useState } from 'react';
import { FlatList, Text, View } from 'react-native';

import { Screen } from '@/src/components/Screen';
import { DaySelector } from '@/src/components/DaySelector';
import { ProjectCard } from '@/src/components/ProjectCard';
import { PromptSheet, TandaDetailSheet } from '@/src/components/TandaSheets';
import { useProjects } from '@/src/state/ProjectsContext';
import { usePullToRefresh } from '@/src/lib/usePullToRefresh';
import { Project, WeekDay } from '@/src/types';

const DAY_INDEX: Record<number, WeekDay> = {
  0: 'Dom',
  1: 'Lun',
  2: 'Mar',
  3: 'Mié',
  4: 'Jue',
  5: 'Vie',
  6: 'Sáb',
};

export default function AgendaScreen() {
  const { projects } = useProjects();
  const [selectedDay, setSelectedDay] = useState<WeekDay>(() => DAY_INDEX[new Date().getDay()]);
  const [detailProject, setDetailProject] = useState<Project | null>(null);
  const [promptProject, setPromptProject] = useState<Project | null>(null);

  const dayProjects = useMemo(
    () => projects.filter((project) => project.day === selectedDay),
    [projects, selectedDay],
  );

  const { refreshControl } = usePullToRefresh();

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
        contentContainerClassName="gap-3 px-4 pb-8 pt-4"
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
            <Text className="text-sm text-slate-400">
              No hay proyectos para este día. Elegí otro día para ver tu agenda.
            </Text>
          </View>
        }
      />

      <TandaDetailSheet
        project={detailProject}
        onClose={() => setDetailProject(null)}
        onShowPrompt={(project) => {
          setDetailProject(null);
          setPromptProject(project);
        }}
      />
      <PromptSheet project={promptProject} onClose={() => setPromptProject(null)} />
    </Screen>
  );
}
