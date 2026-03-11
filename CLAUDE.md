# DashboardGastos — Convenciones del Proyecto

**Stack**: React 18 + Vite + TypeScript strict + Tailwind v4 + Supabase + Zustand

## Comandos

```bash
pnpm dev          # Servidor de desarrollo
pnpm build        # Build de producción
pnpm preview      # Preview del build
```

> Siempre **pnpm** — nunca npm ni yarn.

## Estructura de archivos

```
src/
├── components/   # Componentes por dominio: auth/, categories/, dashboard/, transactions/, ui/
├── pages/        # Una página por ruta: LoginPage, RegisterPage, DashboardPage, etc.
├── stores/       # Zustand stores: auth.store.ts, category.store.ts, transaction.store.ts
├── lib/          # Clientes externos: supabase.ts, pdf.ts
├── types/        # Tipos TypeScript: database.types.ts
├── App.tsx       # Router config (createBrowserRouter)
├── main.tsx      # Entry point + auth.initialize()
└── index.css     # @import "tailwindcss" (Tailwind v4 CSS-first)
```

## Convenciones de naming

- Archivos: `kebab-case.tsx`
- Componentes: `PascalCase`
- Hooks: `useCamelCase`
- Stores: `camelCase.store.ts`
- Tipos: `PascalCase` (sin prefijo I-)
- Constantes: `UPPER_SNAKE_CASE`

## Imports

- Siempre absolutos: `@/components/...`, `@/stores/...`, `@/lib/...`
- Nunca relativos `../../`

## Tailwind v4

- Sin `tailwind.config.js` — configuración CSS-first via `@theme {}` en `index.css`
- Sin `postcss.config.js` — el plugin `@tailwindcss/vite` lo maneja

## Supabase

- Cliente en `src/lib/supabase.ts` — importar desde ahí
- RLS activado en todas las tablas: `profiles`, `categories`, `transactions`
- Nunca consultar sin autenticación activa verificada

## Stores Zustand

- Un store por dominio
- Sin `persist` middleware (Supabase es la fuente de verdad)
- Acciones async con try/catch explícito, exponer `error: string | null`

## Formularios

- React Hook Form + Zod siempre
- Validación: `@hookform/resolvers/zod`
- Errores inline en el campo, no solo toast

## Touch targets

- Todos los botones e inputs: `min-h-[44px]` (Principio III — Responsive First)

## PDF Export

- Lazy import de jsPDF: `const { default: jsPDF } = await import('jspdf')`
- No impactar bundle inicial

<!-- MANUAL ADDITIONS START -->
<!-- MANUAL ADDITIONS END -->
