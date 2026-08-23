import { useMemo, useState } from 'react';
import { FlatList, Text, TextInput, TouchableOpacity, View } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { CheckCircle2, Search } from 'lucide-react-native';

import { Screen } from '@/src/components/Screen';
import { ProjectCard } from '@/src/components/ProjectCard';
import { PromptSheet, TandaDetailSheet } from '@/src/components/TandaSheets';
import { useProjects } from '@/src/state/ProjectsContext';
import { usePullToRefresh } from '@/src/lib/usePullToRefresh';
import { buildTandaPrompt } from '@/src/lib/prompt';
import { Project, ProjectCategory, PROJECT_CATEGORIES } from '@/src/types';

type CategoryFilter = 'Todos' | ProjectCategory;

const FILTERS: CategoryFilter[] = ['Todos', ...PROJECT_CATEGORIES];

export default function ProyectosScreen() {
  const { projects } = useProjects();
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<CategoryFilter>('Todos');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [detailProject, setDetailProject] = useState<Project | null>(null);
  const [promptProject, setPromptProject] = useState<Project | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return projects.filter((project) => {
      const matchesQuery =
        q.length === 0 ||
        project.name.toLowerCase().includes(q) ||
        (project.alias ?? '').toLowerCase().includes(q);
      const matchesFilter = filter === 'Todos' || project.category === filter;
      return matchesQuery && matchesFilter;
    });
  }, [projects, query, filter]);

  const handleCopyPrompt = async (project: Project) => {
    await Clipboard.setStringAsync(buildTandaPrompt(project));
    setCopiedId(project.id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const { refreshControl } = usePullToRefresh();

  return (
    <Screen>
      <View className="px-4 pt-2">
        <Text className="text-2xl font-extrabold text-slate-100">Proyectos</Text>
        <Text className="mt-1 text-sm text-slate-400">
          {filtered.length} de {projects.length} proyectos
        </Text>

        <View className="mt-4 flex-row items-center gap-2 rounded-xl border border-slate-700/50 bg-slate-800 px-3 py-2.5">
          <Search size={18} color="#64748b" />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Buscar por nombre..."
            placeholderTextColor="#64748b"
            className="flex-1 text-sm text-slate-100"
            autoCorrect={false}
          />
        </View>

        <FlatList
          horizontal
          data={FILTERS}
          keyExtractor={(item) => item}
          showsHorizontalScrollIndicator={false}
          className="mt-3"
          contentContainerClassName="gap-2"
          renderItem={({ item }) => {
            const isSelected = item === filter;
            return (
              <TouchableOpacity
                accessibilityRole="button"
                accessibilityState={{ selected: isSelected }}
                onPress={() => setFilter(item)}
                className={`rounded-full border px-3.5 py-1.5 ${
                  isSelected
                    ? 'border-indigo-400 bg-indigo-500'
                    : 'border-slate-700/50 bg-slate-800'
                }`}
              >
                <Text className={`text-xs font-semibold ${isSelected ? 'text-white' : 'text-slate-300'}`}>
                  {item}
                </Text>
              </TouchableOpacity>
            );
          }}
        />
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        contentContainerClassName="gap-3 px-4 pb-8 pt-4"
        showsVerticalScrollIndicator={false}
        refreshControl={refreshControl}
        renderItem={({ item }) => (
          <ProjectCard
            project={item}
            onPress={setDetailProject}
            onCopyPrompt={handleCopyPrompt}
          />
        )}
        ListEmptyComponent={
          <View className="mt-10 items-center rounded-2xl border border-slate-700/50 bg-slate-800 p-6">
            <Text className="text-sm text-slate-400">
              No se encontraron proyectos con ese nombre o categoría.
            </Text>
          </View>
        }
      />

      {copiedId ? (
        <View className="absolute bottom-6 left-6 right-6 z-10 flex-row items-center justify-center gap-2 rounded-xl border border-emerald-500/40 bg-emerald-500/15 px-4 py-3">
          <CheckCircle2 size={16} color="#34d399" />
          <Text className="text-sm font-medium text-emerald-300">
            Prompt de tanda copiado al portapapeles
          </Text>
        </View>
      ) : null}

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
