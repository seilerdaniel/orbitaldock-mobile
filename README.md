# OrbitalDock Mobile 📱

Aplicación móvil y web nativa para la gestión de proyectos, seguimiento de tandas, agenda semanal e inyector de prompts para OpenCode.

## Primer arranque

La app no incluye proyectos de ejemplo: arranca en un **estado vacío** con un botón destacado **Crear Proyecto**. Desde ahí (o desde el FAB `+`) podés crear proyectos; tocando una tarjeta y luego *Editar* podés modificarlos o eliminarlos, con confirmación previa. Los backups JSON se exportan e importan desde Configuración.

## Datos

Los proyectos se guardan en `AsyncStorage` (localStorage en web) y cada alta, edición o borrado se persiste inmediatamente. Todo dato externo —almacenamiento local o backup— pasa por `normalizeProject()`, que completa campos faltantes y descarta valores inválidos. El formato de backup es compatible con OrbitalDock Desktop.

## Live Demo (Vercel)

Desplegado automáticamente a través de la integración con GitHub en Vercel.

## Stack

- React Native + Expo (Managed Workflow, SDK 57)
- Expo Router (Bottom Tabs)
- NativeWind (Tailwind CSS) con tema oscuro OrbitalDock (slate-900 / slate-800 / slate-700)
- Lucide Icons

## Scripts

```bash
npm run start        # Expo dev server (native)
npm run web          # Expo dev server (web)
npm run build:web    # Export estático web para Vercel (dist/)
```

## Despliegue en Vercel

El repositorio se conecta a Vercel con el framework detectado como "Other" (`framework: null`), usando `vercel.json`:

- Build: `npx expo export -p web`
- Output: `dist/`
- Rewrites SPA hacia `/index.html`