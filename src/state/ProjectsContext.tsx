import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';

import { BackupResult, Project } from '@/src/types';
import { normalizeProject, normalizeProjects } from '@/src/lib/normalize';
import { exportBackup as exportBackupToFile, importBackup as importBackupFromFile, loadProjects, saveProjects } from '@/src/lib/backup';

interface ProjectsContextValue {
  projects: Project[];
  loading: boolean;
  /** Creates or replaces a project by id and persists immediately. */
  saveProject: (project: Project) => void;
  /** Removes a project by id and persists immediately. */
  deleteProject: (id: string) => void;
  /** Replaces the whole portfolio (backup import) and persists immediately. */
  replaceProjects: (projects: Project[]) => void;
  exportBackup: () => Promise<BackupResult>;
  importBackup: () => Promise<BackupResult>;
}

const ProjectsContext = createContext<ProjectsContextValue | undefined>(undefined);

export function ProjectsProvider({ children }: { children: ReactNode }) {
  const [projects, setProjectsState] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  // Mirror of the latest list. React may defer state updaters, so the value used
  // to persist must come from a ref, never from a `setState(prev => ...)` closure.
  const projectsRef = useRef<Project[]>([]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      const stored = await loadProjects();
      if (mounted && stored) {
        projectsRef.current = stored;
        setProjectsState(stored);
      }
      if (mounted) setLoading(false);
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const commit = useCallback((next: Project[]) => {
    const normalized = normalizeProjects(next);
    projectsRef.current = normalized;
    setProjectsState(normalized);
    saveProjects(normalized).catch(() => {
      // Local persistence is best-effort; the app keeps working in memory.
    });
  }, []);

  const saveProject = useCallback(
    (project: Project) => {
      const normalized = normalizeProject(project);
      const current = projectsRef.current;
      const exists = current.some((item) => item.id === normalized.id);
      commit(
        exists
          ? current.map((item) => (item.id === normalized.id ? normalized : item))
          : [...current, normalized],
      );
    },
    [commit],
  );

  const deleteProject = useCallback(
    (id: string) => {
      commit(projectsRef.current.filter((project) => project.id !== id));
    },
    [commit],
  );

  const replaceProjects = useCallback(
    (next: Project[]) => {
      commit(next);
    },
    [commit],
  );

  const exportBackup = useCallback(() => exportBackupToFile(projects), [projects]);

  const importBackup = useCallback(async (): Promise<BackupResult> => {
    const result = await importBackupFromFile();
    if (result.ok && result.projects) {
      replaceProjects(result.projects);
    }
    return result;
  }, [replaceProjects]);

  const value = useMemo(
    () => ({
      projects,
      loading,
      saveProject,
      deleteProject,
      replaceProjects,
      exportBackup,
      importBackup,
    }),
    [projects, loading, saveProject, deleteProject, replaceProjects, exportBackup, importBackup],
  );

  return <ProjectsContext.Provider value={value}>{children}</ProjectsContext.Provider>;
}

export function useProjects(): ProjectsContextValue {
  const ctx = useContext(ProjectsContext);
  if (!ctx) {
    throw new Error('useProjects must be used inside <ProjectsProvider>');
  }
  return ctx;
}
