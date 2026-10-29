import {
  PROJECT_CATEGORIES,
  PROJECT_PLATFORMS,
  PROJECT_STATUSES,
  Project,
  ProjectCategory,
  ProjectPlatform,
  ProjectStatus,
  WEEK_DAYS,
  WeekDay,
} from '@/src/types';
import { todayWeekDay } from '@/src/lib/date';

const asString = (value: unknown): string => (typeof value === 'string' ? value : '');

const asAmount = (value: unknown): number => {
  const n = typeof value === 'number' ? value : Number(asString(value).replace(',', '.'));
  return Number.isFinite(n) && n > 0 ? Math.round(n * 100) / 100 : 0;
};

const pick = <T extends string>(value: unknown, allowed: readonly T[], fallback: T): T =>
  allowed.includes(value as T) ? (value as T) : fallback;

/** UUID v4 when the runtime exposes crypto, otherwise a collision-resistant fallback. */
export function createId(): string {
  const cryptoObj = (globalThis as { crypto?: { randomUUID?: () => string } }).crypto;
  if (cryptoObj?.randomUUID) return cryptoObj.randomUUID();
  return `p-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

/**
 * Data boundary for the whole app: every project that comes from AsyncStorage,
 * a backup file or the create form goes through here. Unknown or missing fields
 * get safe defaults so a half-filled project can never crash a screen.
 */
export function normalizeProject(value: unknown): Project {
  const raw = (value && typeof value === 'object' ? value : {}) as Record<string, unknown> & Partial<Project>;
  const alias = asString(raw.alias).trim();
  const costs = (raw.costs && typeof raw.costs === 'object' ? raw.costs : {}) as Record<string, unknown>;

  const project: Project = {
    id: asString(raw.id).trim() || createId(),
    name: asString(raw.name).trim() || 'Proyecto sin nombre',
    day: pick<WeekDay>(raw.day, WEEK_DAYS, 'Lun'),
    platform: pick<ProjectPlatform>(raw.platform, PROJECT_PLATFORMS, 'Web'),
    category: pick<ProjectCategory>(raw.category, PROJECT_CATEGORIES, 'SaaS Propio'),
    status: pick<ProjectStatus>(raw.status, PROJECT_STATUSES, 'desarrollo'),
    tests: asString(raw.tests).trim(),
    description: asString(raw.description).trim(),
    tasks: Array.isArray(raw.tasks)
      ? raw.tasks.map((task) => asString(task).trim()).filter(Boolean)
      : [],
    costs: { usd: asAmount(costs.usd), ars: asAmount(costs.ars) },
  };

  if (alias) project.alias = alias;

  return project;
}

/** Normalizes a whole list, dropping entries that are not objects and duplicate ids. */
export function normalizeProjects(value: unknown): Project[] {
  if (!Array.isArray(value)) return [];
  const seen = new Set<string>();
  const projects: Project[] = [];
  for (const item of value) {
    if (!item || typeof item !== 'object') continue;
    const project = normalizeProject(item);
    if (seen.has(project.id)) continue;
    seen.add(project.id);
    projects.push(project);
  }
  return projects;
}

/** New project draft: complete shape, ready for the form, nothing persisted until saved. */
export function createBlankProject(day: WeekDay = todayWeekDay()): Project {
  return {
    id: createId(),
    name: '',
    day,
    platform: 'Web',
    category: 'SaaS Propio',
    status: 'desarrollo',
    tests: '',
    description: '',
    tasks: [],
    costs: { usd: 0, ars: 0 },
  };
}
