import { createContext, ReactNode, useCallback, useContext, useMemo, useState } from 'react';

import { ProjectFormSheet } from '@/src/components/ProjectFormSheet';
import { createBlankProject } from '@/src/lib/normalize';
import { useProjects } from '@/src/state/ProjectsContext';
import { Project } from '@/src/types';

interface ProjectEditorValue {
  openNew: () => void;
  openEdit: (project: Project) => void;
}

interface EditorState {
  project: Project;
  isNew: boolean;
}

const ProjectEditorContext = createContext<ProjectEditorValue | undefined>(undefined);

/**
 * Owns the create/edit sheet so every screen only calls openNew/openEdit.
 * Saving and deleting go through ProjectsContext, which persists immediately.
 */
export function ProjectEditorProvider({ children }: { children: ReactNode }) {
  const { saveProject, deleteProject } = useProjects();
  const [state, setState] = useState<EditorState | null>(null);

  const openNew = useCallback(() => setState({ project: createBlankProject(), isNew: true }), []);
  const openEdit = useCallback(
    (project: Project) => setState({ project, isNew: false }),
    [],
  );
  const close = useCallback(() => setState(null), []);

  const value = useMemo(() => ({ openNew, openEdit }), [openNew, openEdit]);

  return (
    <ProjectEditorContext.Provider value={value}>
      {children}
      {state ? (
        <ProjectFormSheet
          key={state.project.id}
          project={state.project}
          isNew={state.isNew}
          onClose={close}
          onSave={(project) => {
            saveProject(project);
            close();
          }}
          onDelete={(id) => {
            deleteProject(id);
            close();
          }}
        />
      ) : null}
    </ProjectEditorContext.Provider>
  );
}

export function useProjectEditor(): ProjectEditorValue {
  const ctx = useContext(ProjectEditorContext);
  if (!ctx) {
    throw new Error('useProjectEditor must be used inside <ProjectEditorProvider>');
  }
  return ctx;
}
