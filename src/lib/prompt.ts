import { Project } from '@/src/types';

/**
 * Builds the "tanda prompt" text for a project: the project context plus its
 * pending tasks, ready to be pasted into OpenCode / the clipboard.
 */
export function buildTandaPrompt(project: Project): string {
  const lines = [
    `Proyecto: ${project.name}${project.alias ? ` (${project.alias})` : ''}`,
    `Categoría: ${project.category}`,
    `Plataforma: ${project.platform}`,
    `Día de tanda: ${project.day}`,
    `Estado: ${STATUS_LABELS[project.status]}`,
    `Tests: ${project.tests}`,
    '',
    `Descripción: ${project.description}`,
    '',
    'Tareas pendientes:',
    ...project.tasks.map((task, index) => `${index + 1}. ${task}`),
  ];
  return lines.join('\n');
}

export const STATUS_LABELS: Record<Project['status'], string> = {
  produccion: 'Producción',
  desarrollo: 'Desarrollo',
  pausa: 'Pausa',
  mantenimiento: 'Mantenimiento',
};