import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from 'react';

import { BackupResult, Project } from '@/src/types';
import { SEED_PROJECTS } from '@/src/data/seed';
import { exportBackup as exportBackupToFile, importBackup as importBackupFromFile, loadProjects, saveProjects } from '@/src/lib/backup';

interface ProjectsContextValue {
  projects: Project[];
  loading: boolean;
  setProjects: (projects: Project[]) => void;
  exportBackup: () => Promise<BackupResult>;
  importBackup: () => Promise<BackupResult>;
}

const ProjectsContext = createContext<ProjectsContextValue | undefined>(undefined);

export function ProjectsProvider({ children }: { children: ReactNode }) {
  const [projects, setProjectsState] = useState<Project[]>(SEED_PROJECTS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      const stored = await loadProjects();
      if (mounted && stored) {
        setProjectsState(stored);
      }
      if (mounted) setLoading(false);
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const setProjects = useCallback((next: Project[]) => {
    setProjectsState(next);
    saveProjects(next).catch(() => {
      // Local persistence is best-effort; the app keeps working in memory.
    });
  }, []);

  const exportBackup = useCallback(() => exportBackupToFile(projects), [projects]);

  const importBackup = useCallback(async (): Promise<BackupResult> => {
    const result = await importBackupFromFile();
    if (result.ok && result.projects) {
      setProjects(result.projects);
    }
    return result;
  }, [setProjects]);

  const value = useMemo(
    () => ({ projects, loading, setProjects, exportBackup, importBackup }),
    [projects, loading, setProjects, exportBackup, importBackup],
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