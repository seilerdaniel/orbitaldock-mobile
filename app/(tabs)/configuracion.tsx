import { useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { Download, FileJson, HardDriveDownload, RefreshCcw } from 'lucide-react-native';

import { Screen } from '@/src/components/Screen';
import { useProjects } from '@/src/state/ProjectsContext';
import { BackupResult } from '@/src/types';

type Notice = { kind: 'success' | 'error' | 'info'; text: string } | null;

export default function ConfiguracionScreen() {
  const { projects, exportBackup, importBackup } = useProjects();
  const [busy, setBusy] = useState<'export' | 'import' | null>(null);
  const [notice, setNotice] = useState<Notice>(null);

  const showNotice = (result: BackupResult) => {
    setNotice({ kind: result.ok ? 'success' : 'error', text: result.message });
  };

  const handleExport = async () => {
    setBusy('export');
    setNotice(null);
    try {
      showNotice(await exportBackup());
    } finally {
      setBusy(null);
    }
  };

  const handleImport = async () => {
    setBusy('import');
    setNotice(null);
    try {
      showNotice(await importBackup());
    } finally {
      setBusy(null);
    }
  };

  return (
    <Screen>
      <ScrollView contentContainerClassName="gap-4 px-4 pb-10 pt-2">
        <Text className="text-2xl font-extrabold text-slate-100">Configuración</Text>
        <Text className="text-sm text-slate-400">
          Sincronizá tus datos con la app de escritorio exportando e importando copias de seguridad en JSON.
        </Text>

        <View className="rounded-2xl border border-slate-700/50 bg-slate-800 p-4">
          <View className="flex-row items-center gap-3">
            <View className="rounded-xl bg-indigo-500/15 p-2.5">
              <FileJson size={20} color="#818cf8" />
            </View>
            <View className="flex-1">
              <Text className="text-sm font-semibold text-slate-100">Copia de seguridad</Text>
              <Text className="text-xs text-slate-400">
                {projects.length} proyectos · formato JSON compatible con OrbitalDock desktop
              </Text>
            </View>
          </View>

          <View className="mt-4 gap-3">
            <TouchableOpacity
              accessibilityRole="button"
              disabled={busy !== null}
              onPress={handleExport}
              className="flex-row items-center justify-center gap-2 rounded-xl border border-indigo-400/40 bg-indigo-500/15 px-4 py-3"
            >
              <Download size={18} color="#a5b4fc" />
              <Text className="text-sm font-semibold text-indigo-300">
                {busy === 'export' ? 'Exportando...' : 'Exportar backup JSON'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              accessibilityRole="button"
              disabled={busy !== null}
              onPress={handleImport}
              className="flex-row items-center justify-center gap-2 rounded-xl border border-slate-600/60 bg-slate-900/60 px-4 py-3"
            >
              <HardDriveDownload size={18} color="#94a3b8" />
              <Text className="text-sm font-semibold text-slate-300">
                {busy === 'import' ? 'Importando...' : 'Importar backup JSON'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {notice ? (
          <View
            className={`rounded-xl border px-4 py-3 ${
              notice.kind === 'success'
                ? 'border-emerald-500/40 bg-emerald-500/15'
                : notice.kind === 'error'
                  ? 'border-red-500/40 bg-red-500/15'
                  : 'border-slate-600/60 bg-slate-800'
            }`}
          >
            <Text
              className={`text-sm ${
                notice.kind === 'success'
                  ? 'text-emerald-300'
                  : notice.kind === 'error'
                    ? 'text-red-300'
                    : 'text-slate-300'
              }`}
            >
              {notice.text}
            </Text>
          </View>
        ) : null}

        <View className="rounded-2xl border border-slate-700/50 bg-slate-800 p-4">
          <Text className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Acerca de
          </Text>
          <Text className="mt-2 text-sm leading-5 text-slate-400">
            OrbitalDock Mobile · React Native + Expo + NativeWind. Los datos se guardan localmente en
            el dispositivo. Usá la copia de seguridad JSON para sincronizar con la app de escritorio.
          </Text>
          <View className="mt-3 flex-row items-center gap-2">
            <RefreshCcw size={14} color="#64748b" />
            <Text className="text-xs text-slate-500">Versión 1.0.0</Text>
          </View>
        </View>
      </ScrollView>
    </Screen>
  );
}