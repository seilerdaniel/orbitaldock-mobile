import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as DocumentPicker from 'expo-document-picker';
import * as Sharing from 'expo-sharing';
import { Directory, File, Paths } from 'expo-file-system';

import { BackupPayload, BackupResult, Project } from '@/src/types';
import { normalizeProjects } from '@/src/lib/normalize';

const STORAGE_KEY = 'orbitaldock.projects.v1';
const BACKUP_FILE_NAME = 'orbitaldock-backup.json';

function toBackupPayload(projects: Project[]): BackupPayload {
  return {
    version: 1,
    exportedAt: new Date().toISOString(),
    projects,
  };
}

export async function loadProjects(): Promise<Project[] | null> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as { projects?: Project[] };
    return Array.isArray(parsed.projects) ? normalizeProjects(parsed.projects) : null;
  } catch {
    return null;
  }
}

export async function saveProjects(projects: Project[]): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(toBackupPayload(projects)));
}

async function downloadBlobOnWeb(blob: Blob, filename: string): Promise<void> {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
}

export async function exportBackup(projects: Project[]): Promise<BackupResult> {
  try {
    const payload = toBackupPayload(projects);
    const json = JSON.stringify(payload, null, 2);

    if (Platform.OS === 'web') {
      const blob = new Blob([json], { type: 'application/json' });
      await downloadBlobOnWeb(blob, BACKUP_FILE_NAME);
      return { ok: true, message: `Copia de seguridad descargada como ${BACKUP_FILE_NAME}` };
    }

    const backupsDir = new Directory(Paths.document, 'backups');
    backupsDir.create({ intermediates: true, idempotent: true });
    const file = new File(backupsDir, BACKUP_FILE_NAME);
    file.write(json);

    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(file.uri, {
        mimeType: 'application/json',
        dialogTitle: 'OrbitalDock backup',
        UTI: 'public.json',
      });
      return { ok: true, message: 'Copia de seguridad compartida desde ' + file.uri };
    }

    return { ok: true, message: `Copia guardada en ${file.uri}` };
  } catch (error) {
    return { ok: false, message: `Error al exportar: ${String(error)}` };
  }
}

export async function importBackup(): Promise<BackupResult> {
  try {
    const result = await DocumentPicker.getDocumentAsync({
      type: 'application/json',
      copyToCacheDirectory: true,
      multiple: false,
    });

    if (result.canceled || !result.assets?.length) {
      return { ok: false, message: 'Importación cancelada' };
    }

    const asset = result.assets[0];
    let json = '';

    if (Platform.OS === 'web' && asset.file) {
      json = await asset.file.text();
    } else if (asset.base64) {
      json = atob(asset.base64);
    } else {
      json = await new File(asset.uri).text();
    }

    const parsed = JSON.parse(json) as BackupPayload;
    if (!parsed || !Array.isArray(parsed.projects)) {
      return { ok: false, message: 'El archivo no es una copia de seguridad válida de OrbitalDock' };
    }

    const projects = normalizeProjects(parsed.projects);
    await saveProjects(projects);
    return { ok: true, message: `Importados ${projects.length} proyectos correctamente`, projects };
  } catch (error) {
    return { ok: false, message: `Error al importar: ${String(error)}` };
  }
}