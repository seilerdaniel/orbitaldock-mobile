# OrbitalDock Mobile 📱

Aplicación móvil y web nativa para la gestión de proyectos, seguimiento de tandas, agenda semanal e inyector de prompts para OpenCode.

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