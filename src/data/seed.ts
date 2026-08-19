import { Project } from '@/src/types';

/**
 * Initial seed with the 10 OrbitalDock portfolio projects.
 * Fields mirror the desktop workspace: day of tanda, platform, category,
 * test evidence, monthly costs (USD/ARS) and pending tasks.
 */
export const SEED_PROJECTS: Project[] = [
  {
    id: 'unmango',
    name: 'UnMango',
    day: 'Lun',
    platform: 'Web',
    category: 'SaaS Propio',
    status: 'produccion',
    tests: '827/827',
    description:
      'SaaS de gestión para creadores digitales: panel de métricas, seguimiento de contenido y reportes exportables.',
    tasks: [
      'Revisar métricas del panel de la última semana',
      'Preparar release 2.4 con el nuevo dashboard',
      'Verificar el flujo de exportación de reportes',
    ],
    costs: { usd: 12, ars: 0 },
  },
  {
    id: 'glenwyn',
    name: 'Glenwyn',
    day: 'Mar',
    platform: 'Web',
    category: 'SaaS Propio',
    status: 'desarrollo',
    tests: '83/83',
    description:
      'Plataforma SaaS en crecimiento con autenticación, onboarding y módulo de suscripciones.',
    tasks: [
      'Avanzar con el módulo de suscripciones',
      'Pulir el onboarding para nuevos usuarios',
      'Agregar tests del flujo de pago',
    ],
    costs: { usd: 9, ars: 0 },
  },
  {
    id: 'acepto-mascotas',
    name: 'Acepto Mascotas',
    day: 'Mié',
    platform: 'Web',
    category: 'SaaS Propio',
    status: 'pausa',
    tests: '82/82',
    description:
      'Directorio para adoptar mascotas: fichas, búsqueda por ubicación y contacto con refugios.',
    tasks: [
      'Evaluar el módulo de búsqueda por ubicación',
      'Revisar la integración con el formulario de refugios',
    ],
    costs: { usd: 6, ars: 0 },
  },
  {
    id: 'gi-reyes-imagen',
    name: 'Gi Reyes Imagen',
    day: 'Jue',
    platform: 'Web',
    category: 'Servicio Comercial',
    status: 'produccion',
    tests: 'N/A',
    description:
      'Sitio comercial para estudio de imagen y fotografía: portfolio, servicios y contacto.',
    tasks: [
      'Actualizar el portfolio con las últimas sesiones',
      'Renovar textos de servicios',
      'Cargar testimonios de clientes',
    ],
    costs: { usd: 0, ars: 8000 },
  },
  {
    id: 'dantech-studio',
    name: 'DanTech-Studio',
    day: 'Vie',
    platform: 'Desktop',
    category: 'Servicio Comercial',
    status: 'desarrollo',
    tests: 'Build OK',
    description:
      'Aplicación de escritorio para clientes: gestión de pedidos, presupuestos y seguimiento.',
    tasks: [
      'Implementar la pantalla de presupuestos',
      'Conectar el seguimiento de pedidos con la base local',
      'Generar build de prueba para el cliente',
    ],
    costs: { usd: 0, ars: 0 },
  },
  {
    id: 'portal-danez',
    name: 'Portal Danez',
    day: 'Vie',
    platform: 'Web',
    category: 'Servicio Comercial',
    status: 'mantenimiento',
    tests: '0/0',
    description:
      'Portal web corporativo con noticias, panel de administración y zona de clientes.',
    tasks: [
      'Corregir el formulario de contacto que no envía mails',
      'Actualizar dependencias del CMS',
      'Revisar el certificado SSL del dominio',
    ],
    costs: { usd: 5, ars: 15000 },
  },
  {
    id: 'browser-minimalista',
    name: 'Browser Minimalista',
    alias: 'Productivity Hub',
    day: 'Sáb',
    platform: 'Desktop',
    category: 'Experimento/Utility',
    status: 'pausa',
    tests: 'N/A',
    description:
      'Navegador de escritorio ultra minimalista pensado para concentración y productividad.',
    tasks: [
      'Probar el manejo de pestañas con sesiones largas',
      'Evaluar el modo de distracción cero',
    ],
    costs: { usd: 0, ars: 0 },
  },
  {
    id: 'app-redes',
    name: 'App Redes',
    alias: 'SaaS CM Autónomo',
    day: 'Sáb',
    platform: 'Web',
    category: 'SaaS Propio',
    status: 'desarrollo',
    tests: 'N/A',
    description:
      'SaaS de community management autónomo: programación, generación de contenido y reportes de redes.',
    tasks: [
      'Diseñar el flujo de conexión de cuentas',
      'Implementar el programador de publicaciones',
      'Definir el plan gratuito vs. pago',
    ],
    costs: { usd: 15, ars: 0 },
  },
  {
    id: 'launcher-minimalista',
    name: 'Launcher Minimalista',
    day: 'Dom',
    platform: 'Mobile',
    category: 'Experimento/Utility',
    status: 'pausa',
    tests: 'N/A',
    description:
      'Launcher para Android con pantalla limpia, gestos rápidos y búsqueda instantánea de apps.',
    tasks: [
      'Probar el launcher en el dispositivo real',
      'Pulir la animación de apertura de apps',
    ],
    costs: { usd: 0, ars: 0 },
  },
  {
    id: 'orbitaldock',
    name: 'OrbitalDock',
    day: 'Dom',
    platform: 'Desktop',
    category: 'Experimento/Utility',
    status: 'desarrollo',
    tests: 'Build OK',
    description:
      'Hub de escritorio que centraliza el portafolio, las tandas de trabajo y los prompts para OpenCode.',
    tasks: [
      'Sincronizar datos con la versión mobile vía backup JSON',
      'Agregar el resumen de costos mensuales',
      'Generar build de prueba del nuevo módulo de finanzas',
    ],
    costs: { usd: 0, ars: 0 },
  },
];