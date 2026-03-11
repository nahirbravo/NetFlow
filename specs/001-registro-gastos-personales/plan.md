# Implementation Plan: Registro de Gastos Personales — MVP

**Branch**: `001-registro-gastos-personales` | **Date**: 2026-03-10
**Spec**: `specs/001-registro-gastos-personales/spec.md`
**Research**: `specs/001-registro-gastos-personales/research.md`
**Constitution**: `.specify/memory/constitution.md` v1.0.0

---

## Summary

SPA personal de finanzas construida con React 18 + Vite + TypeScript + Tailwind v4 y
Supabase como BaaS (PostgreSQL + Auth + RLS). El usuario registra ingresos/gastos,
los visualiza en un dashboard con gráfico de torta por categoría, y exporta un PDF
completo con jsPDF + jspdf-autotable. Arquitectura de 3 stores Zustand (auth,
categories, transactions), con RLS activado en todas las tablas de datos de usuario.

---

## Technical Context

**Language/Version**: TypeScript 5.x / React 18.3
**Primary Dependencies**: `@supabase/supabase-js`, `zustand`, `react-router-dom` v6,
`react-hook-form`, `@hookform/resolvers`, `zod`, `recharts`, `jspdf`, `jspdf-autotable`,
`tailwindcss` v4 + `@tailwindcss/vite`
**Storage**: Supabase PostgreSQL (tablas: `profiles`, `categories`, `transactions`) +
RLS activado en las 3. Auth via Supabase Auth (email/password).
**Testing**: Fuera del scope del MVP. Verificación manual de RLS. Post-MVP: vitest +
@testing-library/react.
**Target Platform**: Web browser (Chrome, Safari, Firefox) — mobile-responsive SPA.
**Project Type**: Single Page Application (SPA) — sin SSR.
**Performance Goals**: Registrar un movimiento < 30s (Principio II). Bundle inicial
razonable (no cargar jsPDF hasta que el usuario solicite exportar).
**Constraints**: RLS obligatorio en todas las tablas de usuario (Principio I). Diseño
desde 320 px de ancho (Principio III). Touch targets ≥ 44×44 px (Principio III).
PDF incluye 100% de transacciones sin paginación oculta (Principio IV).
**Scale/Scope**: MVP personal. Estimado < 1 000 transacciones por usuario.

---

## Constitution Check

*GATE: validado antes de Phase 0. Re-validado post-Phase 1.*

| Principio | Requisito | Plan | Estado |
|---|---|---|---|
| I. Privacidad de Datos | RLS en todas las tablas de usuario | `profiles`, `categories`, `transactions` tienen RLS; `ProtectedRoute` bloquea rutas sin sesión | ✅ PASS |
| I. Privacidad de Datos | Pruebas de aislamiento entre usuarios | Verificación manual con SQL + JWT alternativo en Supabase | ✅ PASS (manual) |
| II. Simplicidad ante Todo | Flujo registro < 30s | `TransactionForm` tiene 5 campos, todos en una pantalla, sin pasos | ✅ PASS |
| II. Simplicidad ante Todo | Sin campos opcionales bloqueantes | `description` es opcional y no bloquea el submit | ✅ PASS |
| III. Responsive First | Funcional desde 320 px | Tailwind v4 mobile-first; layouts en columna en mobile | ✅ PASS |
| III. Responsive First | Touch targets ≥ 44×44 px | `min-h-[44px]` en todos los botones e inputs | ✅ PASS |
| IV. Soberanía del Usuario | PDF disponible en MVP | Fase 5, no diferida | ✅ PASS |
| IV. Soberanía del Usuario | PDF 100% de transacciones | jspdf-autotable sin paginación oculta; todas las rows | ✅ PASS |

**Resultado**: ✅ 8/8 gates pasan. Sin violaciones. Complexity Tracking no aplica.

---

## Project Structure

### Documentation (this feature)

```text
specs/001-registro-gastos-personales/
├── plan.md              ← este archivo
├── research.md          ← Phase 0 ✅ generado
├── data-model.md        ← Phase 1 ✅ generado
├── quickstart.md        ← Phase 1 ✅ generado
├── contracts/
│   ├── supabase-schema.ts   ← Phase 1 ✅ generado
│   └── rls-policies.md      ← Phase 1 ✅ generado
└── tasks.md             ← Phase 2 (NOT yet — /speckit.tasks)
```

### Source Code (repository root)

```text
src/
├── components/
│   ├── auth/
│   │   ├── LoginForm.tsx
│   │   └── RegisterForm.tsx
│   ├── categories/
│   │   ├── CategoryList.tsx
│   │   ├── CategoryForm.tsx
│   │   └── CategoryBadge.tsx
│   ├── dashboard/
│   │   ├── BalanceCard.tsx
│   │   ├── ExpensePieChart.tsx
│   │   ├── RecentTransactions.tsx
│   │   ├── DateRangePicker.tsx
│   │   └── ExportPDFButton.tsx
│   ├── transactions/
│   │   ├── TransactionList.tsx
│   │   ├── TransactionItem.tsx
│   │   ├── TransactionForm.tsx
│   │   └── TransactionFilters.tsx
│   └── ui/
│       ├── ProtectedRoute.tsx
│       ├── AppLayout.tsx
│       ├── Spinner.tsx
│       └── EmptyState.tsx
├── pages/
│   ├── LoginPage.tsx
│   ├── RegisterPage.tsx
│   ├── DashboardPage.tsx
│   ├── TransactionsPage.tsx
│   └── CategoriesPage.tsx
├── stores/
│   ├── auth.store.ts
│   ├── category.store.ts
│   └── transaction.store.ts
├── lib/
│   ├── supabase.ts
│   └── pdf.ts
├── types/
│   └── database.types.ts
├── App.tsx
├── main.tsx
└── index.css

.env.example
```

**Structure Decision**: Single-project SPA (Option 1 adaptado). No hay backend
separado; Supabase actúa como BaaS completo. La carpeta `lib/` concentra clientes
externos. Un archivo de tipos generado/manual centraliza los tipos de DB.

---

## Complexity Tracking

> No se registran violaciones — todos los Constitution Gates pasan.

---

## Implementation Phases

### Fase 1 — Setup y Auth

**Objetivo**: Proyecto corriendo con login/registro funcional.

**Prerrequisitos**: Node 20+, pnpm, cuenta Supabase.

**Tareas**:
1. `pnpm create vite@latest . -- --template react-ts` (en directorio ya existente)
2. Instalar dependencias (ver quickstart.md para comando completo)
3. Configurar Tailwind v4: plugin en `vite.config.ts` + `@import "tailwindcss"` en CSS
4. Crear proyecto en Supabase → copiar URL y anon key a `.env.local`
5. Crear `src/lib/supabase.ts` — cliente Supabase
6. Crear `src/types/database.types.ts` — tipos de DB
7. Crear `src/stores/auth.store.ts` — Zustand con `signIn`, `signUp`, `signOut`, `initialize`
8. Crear `LoginPage` + `LoginForm` (RHF + Zod)
9. Crear `RegisterPage` + `RegisterForm`
10. Crear `ProtectedRoute` — redirige a `/login` si no hay sesión
11. Crear `AppLayout` con navbar + outlet
12. Configurar rutas en `App.tsx` con `createBrowserRouter`

**Checkpoint**: Puedo registrarme, iniciar sesión, ver el layout con navbar, cerrar sesión.

---

### Fase 2 — Base de datos y Categorías

**Objetivo**: Schema Supabase listo y categorías funcionando.

**Tareas**:
1. Ejecutar migrations SQL (ver `contracts/supabase-schema.ts` y `contracts/rls-policies.md`)
   - Tabla `profiles` con trigger auto-insert on auth.users
   - Tabla `categories` con `is_system` y `user_id` nullable
   - Tabla `transactions` con FK a categories (`ON DELETE SET NULL`)
2. Configurar RLS policies (ver `contracts/rls-policies.md`)
3. Insertar seed de 10 categorías del sistema (ver data-model.md)
4. Crear `src/stores/category.store.ts`
5. Crear `CategoriesPage` + `CategoryList` + `CategoryBadge`
6. Crear `CategoryForm` (nombre, color hex, emoji icon)
7. Lógica: categorías del sistema no tienen botón editar/eliminar

**Checkpoint**: Veo las 10 categorías del sistema, puedo agregar las mías, editar y eliminar.

---

### Fase 3 — Transacciones (CRUD)

**Objetivo**: Registrar, ver, editar y eliminar movimientos.

**Tareas**:
1. Crear `src/stores/transaction.store.ts`
2. Crear `TransactionsPage` + `TransactionList` con paginación (25/página)
3. Crear `TransactionForm` (monto, tipo, categoría, fecha, descripción opcional)
   - Validación Zod: `amount > 0`, `date` requerida, `category_id` requerida
4. Crear `TransactionItem` con menú editar/eliminar
5. Crear `TransactionFilters` (tipo, categoría, desde/hasta con `<input type="date">`)
6. Validación de filtros: si `dateFrom > dateTo` → error inline

**Checkpoint**: Registro ingreso y gasto, los veo en la lista, edito y elimino.

---

### Fase 4 — Dashboard

**Objetivo**: Vista principal con resumen visual del período.

**Tareas**:
1. Crear `DashboardPage` como ruta `/` post-login
2. Crear `DateRangePicker` (from/to, default: inicio y fin del mes actual)
3. Crear `BalanceCard` — ingresos totales, gastos totales, balance neto
   - Calculado en frontend con `reduce()` sobre transacciones filtradas del store
4. Crear `ExpensePieChart` con Recharts
   - `groupBy(category)` → `PieChart` con `Pie`, `Cell`, `Tooltip`
   - Color de cada `Cell` = `category.color`
5. Crear `RecentTransactions` (últimas 5, enlace a `/transactions`)
6. Layout responsive: grid en desktop, columna en mobile

**Checkpoint**: Dashboard muestra balance, gráfico y recientes. Cambiar rango actualiza todo.

---

### Fase 5 — Exportación PDF

**Objetivo**: Descargar PDF con todos los movimientos del período.

**Tareas**:
1. Crear `src/lib/pdf.ts` — función `generatePDF(transactions, dateRange, user)`
   - Header: nombre del usuario, período, fecha de exportación
   - Sección summary: ingresos, gastos, balance
   - Tabla: `autoTable(doc, { head, body })` con columnas fecha|descripción|categoría|tipo|monto
2. Lazy load de jsPDF: `const { default: jsPDF } = await import('jspdf')`
3. Crear `ExportPDFButton` en Dashboard
   - Deshabilitado si no hay transacciones en el período
   - Estado `loading` mientras genera (spinner inline)
4. Nombre de archivo: `gastos-YYYY-MM-DD_al_YYYY-MM-DD.pdf`

**Checkpoint**: Descargo PDF con movimientos del período. PDF tiene 100% de las transacciones.

---

### Fase 6 — Polish y Edge Cases

**Objetivo**: App funcional en todos los estados posibles.

**Tareas**:
1. Estados vacíos en dashboard y lista de transacciones (componente `EmptyState`)
2. Skeleton loaders en todas las listas mientras carga
3. Manejo de errores: toast o mensaje inline — no solo console
4. Verificar rutas protegidas: `/dashboard` sin login → `/login` (sin flash)
5. Responsive checklist: Login/Register, Dashboard, Transacciones, Formularios en 320px
6. Touch targets: auditoría de botones e inputs con `min-h-[44px]`
7. `.env.example` con variables sin valores reales
8. CLAUDE.md con convenciones del proyecto

**Checkpoint final**: App funcional en todos los estados. PDF operativo. Mobile ✅.

---

## Key Technical Decisions (justificados en research.md)

| Decisión | Elección | Motivo |
|---|---|---|
| PDF library | jsPDF + jspdf-autotable | Bundle 4x más liviano que @react-pdf/renderer |
| Tailwind | v4 CSS-first | Ya en dependencias; 3-10x más rápido que v3 |
| Lista transactions | Paginación (25/página) | Filtros que resetean + datos financieros |
| Date range | Inputs nativos `type="date"` | Zero deps; picker nativo del SO en mobile |
| Testing | Manual para MVP | Fuera del scope; post-MVP: vitest |
| PDF load | Lazy import | No impactar bundle inicial |
