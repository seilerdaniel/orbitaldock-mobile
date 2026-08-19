export type ProjectStatus = 'produccion' | 'desarrollo' | 'pausa' | 'mantenimiento';

export type ProjectCategory = 'SaaS Propio' | 'Servicio Comercial' | 'Experimento/Utility';

export type ProjectPlatform = 'Web' | 'Desktop' | 'Mobile';

export type WeekDay = 'Lun' | 'Mar' | 'Mié' | 'Jue' | 'Vie' | 'Sáb' | 'Dom';

export const WEEK_DAYS: WeekDay[] = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

export const PROJECT_CATEGORIES: ProjectCategory[] = [
  'SaaS Propio',
  'Servicio Comercial',
  'Experimento/Utility',
];

export interface ProjectCosts {
  /** Monthly cost in USD */
  usd: number;
  /** Monthly cost in ARS */
  ars: number;
}

export interface Project {
  id: string;
  name: string;
  alias?: string;
  day: WeekDay;
  platform: ProjectPlatform;
  category: ProjectCategory;
  status: ProjectStatus;
  /** Test evidence, e.g. "827/827", "Build OK", "N/A" */
  tests: string;
  description: string;
  tasks: string[];
  costs: ProjectCosts;
}

export interface BackupPayload {
  version: 1;
  exportedAt: string;
  projects: Project[];
}

export interface BackupResult {
  ok: boolean;
  message: string;
  projects?: Project[];
}