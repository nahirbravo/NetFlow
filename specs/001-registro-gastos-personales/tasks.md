---

description: "Task list for Registro de Gastos Personales — MVP"

---

# Tasks: Registro de Gastos Personales — MVP

**Input**: Design documents from `/specs/001-registro-gastos-personales/`
**Prerequisites**: plan.md ✅ | spec.md ✅ | research.md ✅ | data-model.md ✅ | contracts/ ✅
**Tests**: Not requested — manual validation via checkpoints.

**Organization**: Tasks grouped by user story. Each story is independently testable.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no blocking dependencies)
- **[Story]**: US1–US5 mapping to spec.md user stories

---

## Phase 1: Setup (Proyecto e Infraestructura base)

**Purpose**: Inicializar el proyecto Vite + React + TypeScript + Tailwind v4 y dejar
el entorno listo para implementar.

- [x] T001 Inicializar proyecto con `pnpm create vite@latest . -- --template react-ts` y commit inicial
- [x] T002 Instalar dependencias de producción: `@supabase/supabase-js zustand react-router-dom react-hook-form @hookform/resolvers zod recharts jspdf jspdf-autotable` en `package.json`
- [x] T003 [P] Instalar dependencias de desarrollo: `tailwindcss @tailwindcss/vite @types/jspdf-autotable` en `package.json`
- [x] T004 Configurar Tailwind v4: agregar plugin en `vite.config.ts` y reemplazar `src/index.css` con `@import "tailwindcss"`
- [x] T005 [P] Crear `.env.example` con `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY` (sin valores reales)
- [x] T006 [P] Crear `CLAUDE.md` en raíz con convenciones del proyecto (pnpm, kebab-case, absolute imports, Tailwind v4)

**Checkpoint**: `pnpm dev` arranca en `localhost:5173` sin errores de compilación. Tailwind compila clases de prueba.

---

## Phase 2: Foundational (Prerequisitos bloqueantes para todas las User Stories)

**Purpose**: Base de datos, tipos TypeScript, cliente Supabase, layout y routing scaffold
que DEBEN estar completos antes de cualquier user story.

**⚠️ CRÍTICO**: Ninguna user story puede comenzar hasta que esta fase esté completa.

- [ ] T007 Ejecutar `specs/001-registro-gastos-personales/contracts/supabase-schema.sql` en Supabase SQL Editor — crea tablas `profiles`, `categories`, `transactions`, trigger `on_auth_user_created`, trigger `on_transactions_updated`, índices y seed de 10 categorías del sistema
- [ ] T008 Ejecutar `specs/001-registro-gastos-personales/contracts/rls-policies.sql` en Supabase SQL Editor — activa RLS y crea todas las policies de `profiles`, `categories` y `transactions`
- [x] T009 Crear `src/lib/supabase.ts` con `createClient(VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY)` y guard para variables faltantes
- [x] T010 [P] Crear `src/types/database.types.ts` con interfaces `Profile`, `Category`, `Transaction`, `TransactionType`, `TransactionFilters`, `TransactionFormValues`, `CategoryFormValues` según `data-model.md`
- [x] T011 [P] Crear `src/components/ui/Spinner.tsx` — spinner SVG animado con Tailwind, props: `size?: 'sm' | 'md' | 'lg'`
- [x] T012 [P] Crear `src/components/ui/EmptyState.tsx` — componente con icono, título y descripción opcionales, props: `title: string, description?: string, icon?: string`
- [x] T013 Crear `src/stores/category.store.ts` con Zustand — estado `categories: Category[]`, `loading: boolean`, `error: string | null`; acciones `fetchCategories()` (SELECT system + own via Supabase), `addCategory()`, `updateCategory()`, `deleteCategory()`
- [x] T014 Crear `src/components/ui/AppLayout.tsx` con navbar fija (links: Dashboard `/`, Transacciones `/transactions`, Categorías `/categories`) y `<Outlet />` para contenido
- [x] T015 Crear `src/components/ui/ProtectedRoute.tsx` — HOC que verifica `useAuthStore.session`; si null redirige a `/login` con `<Navigate to="/login" replace />`
- [x] T016 Crear `src/App.tsx` con `createBrowserRouter`: rutas públicas `/login` y `/register`; rutas protegidas `/` → `DashboardPage`, `/transactions` → `TransactionsPage`, `/categories` → `CategoriesPage` (usar placeholders vacíos para pages aún no creadas)

**Checkpoint**: La app compila sin errores. Navegar a `/` redirige a `/login` (placeholder). Las tablas de Supabase existen con RLS activado y 10 categorías de seed visibles en Table Editor.

---

## Phase 3: User Story 1 — Autenticación (Priority: P1) 🎯 MVP

**Goal**: Registro, login y logout funcionales con Supabase Auth.

**Independent Test**: Crear cuenta nueva con email/password → ver layout con navbar → cerrar sesión → verificar redirección a `/login` → intentar volver con botón atrás del navegador → debe mantenerse en `/login`.

### Implementación US1

- [x] T017 [US1] Crear `src/stores/auth.store.ts` con Zustand — estado `session`, `user`, `loading`; acciones `signIn(email, password)`, `signUp(email, password)`, `signOut()`, `initialize()` (llama `supabase.auth.getSession()` + escucha `onAuthStateChange`)
- [x] T018 [P] [US1] Crear `src/components/auth/LoginForm.tsx` con React Hook Form + Zod — campos `email` (string, email válido) y `password` (string, min 6 chars); muestra error inline en campos y error general del servidor; botón submit con `min-h-[44px]`
- [x] T019 [P] [US1] Crear `src/components/auth/RegisterForm.tsx` con React Hook Form + Zod — campos `email`, `password` y `confirmPassword`; validación `password === confirmPassword`; mismo patrón de errores que `LoginForm`
- [x] T020 [US1] Crear `src/pages/LoginPage.tsx` — usa `LoginForm`, llama `useAuthStore.signIn()`, redirige a `/` on success; link a `/register`
- [x] T021 [US1] Crear `src/pages/RegisterPage.tsx` — usa `RegisterForm`, llama `useAuthStore.signUp()`, redirige a `/` on success; link a `/login`
- [x] T022 [US1] Agregar `initialize()` del auth store en `src/main.tsx` (antes de renderizar, o en `App.tsx` con `useEffect`) para restaurar sesión al recargar la página

**Checkpoint US1**: Puedo registrarme con email nuevo → ver layout vacío con navbar → cerrar sesión → `/login` → volver a ingresar. Acceder a `/transactions` sin login redirige a `/login`.

---

## Phase 4: User Story 2 — Registrar Movimiento (Priority: P1)

**Goal**: CRUD completo de transacciones con filtros y paginación.

**Independent Test**: Logueado con categorías del sistema disponibles → abrir TransactionsPage → crear gasto de $500 en "Alimentación" con fecha hoy → verlo en la lista → editarlo (cambiar monto a $600) → confirmarlo → eliminarlo → verificar que la lista queda vacía.

**Dependencia**: Requiere US1 completa (auth funcionando) y Phase 2 (category.store con fetch).

### Implementación US2

- [x] T023 [US2] Crear `src/stores/transaction.store.ts` con Zustand — estado `transactions: Transaction[]`, `loading: boolean`, `error: string | null`, `filters: TransactionFilters`; acciones `fetchTransactions()` (SELECT con JOIN a categories, ordenado por `date DESC`), `addTransaction()`, `updateTransaction()`, `deleteTransaction()`, `setFilters()`; el store aplica `filters` en memoria sobre el array completo
- [x] T024 [P] [US2] Crear `src/components/transactions/TransactionForm.tsx` con React Hook Form + Zod — campos: `amount` (number, > 0, max 2 decimales), `type` (`'income' | 'expense'`, radio/toggle), `category_id` (select obligatorio, opciones de `useCategoryStore`), `date` (input type="date", default hoy), `description` (textarea opcional, max 255 chars); botón submit `min-h-[44px]`; funciona para crear Y editar (prop `transaction?` pre-llena el form)
- [x] T025 [P] [US2] Crear `src/components/transactions/TransactionFilters.tsx` — filtros: tipo (all/income/expense, botones), category_id (select), date_from y date_to (`<input type="date">` nativos); validación inline si `date_from > date_to`; al cambiar cualquier filtro llama `useTransactionStore.setFilters()` y resetea página a 1
- [x] T026 [P] [US2] Crear `src/components/transactions/TransactionItem.tsx` — fila de transacción con: `CategoryBadge`, descripción (o guión si null), fecha formateada `dd/MM/yyyy`, monto con signo (verde para income, rojo para expense), menú kebab con opciones "Editar" y "Eliminar"; área táctil mínima `min-h-[44px]`
- [x] T027 [US2] Crear `src/components/transactions/TransactionList.tsx` — lista paginada de `TransactionItem`; paginación: 25 items/página, botones Anterior/Siguiente, indicador "Página X de Y"; si lista vacía muestra `EmptyState`; mientras carga muestra 5 `Spinner` skeleton rows
- [x] T028 [US2] Crear `src/pages/TransactionsPage.tsx` — combina `TransactionFilters` + botón "Nuevo movimiento" (abre `TransactionForm` en modal/drawer) + `TransactionList`; gestiona estado de modal y `editingTransaction?: Transaction`; llama `fetchTransactions()` y `fetchCategories()` en `useEffect`

**Checkpoint US2**: Registro ingreso y gasto → los veo en la lista → los edito → los elimino → los filtros funcionan (tipo, categoría, fechas) → paginación funciona si hay > 25 registros.

---

## Phase 5: User Story 4 — Gestionar Categorías (Priority: P2)

**Goal**: CRUD de categorías propias + visualización de categorías del sistema.

**Independent Test**: Logueado → crear categoría "Mascota" con color `#22c55e` y emoji 🐾 → verla en la lista junto a las 10 del sistema → editarla (cambiar nombre a "Mascotas") → confirmar → eliminarla → verificar que las categorías del sistema no tienen botones de editar/eliminar.

**Dependencia**: Requiere US1 completa. Puede empezar en paralelo con US2 si hay dos developers.

### Implementación US4

- [x] T029 [P] [US4] Crear `src/components/categories/CategoryBadge.tsx` — pill con color de fondo `category.color` (hex), emoji `category.icon` y nombre; dos tamaños: `sm` (usado en TransactionItem) y `md` (usado en CategoryList)
- [x] T030 [P] [US4] Crear `src/components/categories/CategoryForm.tsx` con React Hook Form + Zod — campos: `name` (string, 1-50 chars), `color` (`<input type="color">`, default `#6366f1`), `icon` (text input con placeholder "📂", valida 1-2 chars); botón submit `min-h-[44px]`; funciona para crear Y editar
- [x] T031 [US4] Crear `src/components/categories/CategoryList.tsx` — renderiza dos secciones: "Categorías del sistema" (10 items, sin botones editar/eliminar) y "Mis categorías" (items propios con botones editar/eliminar); usa `CategoryBadge`; si sección propia vacía muestra `EmptyState` con mensaje "Aún no tienes categorías propias"
- [x] T032 [US4] Crear `src/pages/CategoriesPage.tsx` — botón "Nueva categoría" + `CategoryList`; gestiona estado de modal para `CategoryForm`; llama `fetchCategories()` en `useEffect`; acciones editar/eliminar conectadas al `category.store`

**Checkpoint US4**: Veo 10 categorías del sistema (no editables). Creo, edito y elimino categorías propias. Las nuevas categorías aparecen en el dropdown de `TransactionForm`.

---

## Phase 6: User Story 3 — Ver Dashboard (Priority: P2)

**Goal**: Vista principal con balance, gráfico de torta por categoría y movimientos recientes.

**Independent Test**: Con ≥2 transacciones (1 ingreso, 1 gasto en 2 categorías distintas) → ver Dashboard → BalanceCard muestra ingresos, gastos y balance correctos → ExpensePieChart renderiza con colores de categoría → RecentTransactions muestra últimas 5 → cambiar DateRangePicker → todos los valores se actualizan.

**Dependencia**: Requiere US2 completa (transacciones en el store) y US4 completa (colores de categorías para el gráfico).

### Implementación US3

- [x] T033 [P] [US3] Crear `src/components/dashboard/DateRangePicker.tsx` — dos `<input type="date">` nativos (from/to); default: primer y último día del mes actual; validación inline si `from > to`; estilo Tailwind con `min-h-[44px]`; llama prop `onChange(from, to)` al cambiar cualquier campo
- [x] T034 [P] [US3] Crear `src/components/dashboard/BalanceCard.tsx` — recibe `totalIncome`, `totalExpenses`, `balance` como props; muestra tres valores con formato de moneda (Intl.NumberFormat); `balance` en verde si ≥0, rojo si <0
- [x] T035 [P] [US3] Crear `src/components/dashboard/ExpensePieChart.tsx` — recibe `data: { name: string, value: number, color: string }[]`; usa Recharts `PieChart + Pie + Cell + Tooltip + Legend`; si `data` vacío muestra `EmptyState`; responsive con `ResponsiveContainer width="100%" height={300}`
- [x] T036 [P] [US3] Crear `src/components/dashboard/RecentTransactions.tsx` — recibe `transactions: Transaction[]` (máx 5); renderiza lista simplificada (no paginada) con `CategoryBadge`, descripción, fecha y monto; enlace "Ver todas" → `/transactions`
- [x] T037 [US3] Crear `src/pages/DashboardPage.tsx` — estado local `dateFrom`, `dateTo`; en `useEffect` llama `fetchTransactions()` y `fetchCategories()`; filtra transacciones del store por el rango de fechas; calcula `totalIncome`, `totalExpenses`, `balance`, `expensesByCategory` con `reduce()`; layout grid responsive (2 columnas en desktop, 1 en mobile ≤ 640px): `BalanceCard`, `DateRangePicker`, `ExpensePieChart`, `RecentTransactions`

**Checkpoint US3**: Dashboard muestra balance, gráfico de torta y últimas 5. Cambiar rango de fechas actualiza todo. Estado vacío visible si no hay transacciones en el período.

---

## Phase 7: User Story 5 — Exportar PDF (Priority: P3)

**Goal**: Descargar reporte PDF completo del período seleccionado.

**Independent Test**: Con ≥1 transacción en el período del dashboard → clic en "Exportar PDF" → se descarga archivo `gastos-YYYY-MM-DD_al_YYYY-MM-DD.pdf` → el PDF contiene: nombre del usuario, período, fecha de exportación, ingresos/gastos/balance, y tabla con TODAS las transacciones del período (columnas: fecha | descripción | categoría | tipo | monto).

**Dependencia**: Requiere US3 completa (dashboard con dateRange).

### Implementación US5

- [x] T038 [US5] Crear `src/lib/pdf.ts` con función `generatePDF(transactions: Transaction[], dateRange: { from: string, to: string }, userEmail: string): void` — carga jsPDF lazy (`await import('jspdf')`), agrega header (nombre/email, período, fecha exportación), sección summary (ingresos, gastos, balance con `doc.text()`), tabla con `autoTable(doc, { head, body })` donde `body` incluye TODAS las transacciones sin paginación oculta; descarga con `doc.save('gastos-{from}_al_{to}.pdf')`
- [x] T039 [US5] Crear `src/components/dashboard/ExportPDFButton.tsx` — botón "Exportar PDF" que recibe `transactions: Transaction[]`, `dateRange`, `userEmail`; deshabilitado si `transactions.length === 0`; estado `loading: boolean` durante la generación (muestra `Spinner` inline + texto "Generando..."); llama `generatePDF()` on click; `min-h-[44px]`
- [x] T040 [US5] Integrar `ExportPDFButton` en `src/pages/DashboardPage.tsx` — pasar `transactions` filtradas por el período, el `dateRange` actual y el email del usuario desde `useAuthStore`

**Checkpoint US5**: Con transacciones en el período → descargo PDF → el PDF contiene el 100% de las transacciones, sin registros faltantes. Sin transacciones → botón deshabilitado.

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Estados edge case, errores, responsive final y validación contra Constitución.

- [x] T041 Auditar todos los botones e inputs de la app: verificar `min-h-[44px]` en cada elemento táctil (Principio III)
- [x] T042 [P] Agregar manejo de errores en `auth.store.ts`: capturar errores de Supabase Auth y exponerlos en el store; mostrar mensaje inline en `LoginForm` y `RegisterForm`
- [x] T043 [P] Agregar manejo de errores en `transaction.store.ts` y `category.store.ts`: capturar errores de Supabase; mostrar toast o mensaje inline en las páginas correspondientes
- [x] T044 Agregar skeleton loaders en `TransactionList.tsx` (5 filas placeholder mientras `loading === true`) y en `DashboardPage.tsx` (placeholders para `BalanceCard` y chart)
- [x] T045 [P] Verificar responsive en 320 px: `LoginPage`, `RegisterPage`, `DashboardPage` (cards apiladas), `TransactionsPage` (tabla scrolleable horizontalmente), `CategoriesPage`, `TransactionForm` en modal/drawer mobile
- [x] T046 [P] Verificar estado vacío en todos los casos: Dashboard sin transacciones → `EmptyState` con mensaje "No hay movimientos en este período"; lista de transacciones vacía → `EmptyState`; lista de categorías propias vacía → `EmptyState`
- [ ] T047 Probar `ExportPDFButton` en mobile (Safari iOS): verificar que la descarga del PDF funciona y el botón es táctil
- [ ] T048 Verificar RLS manualmente siguiendo instrucciones de `contracts/rls-policies.sql` (sección VERIFICATION): confirmar que un usuario no puede ver datos de otro (Principio I — SC-005)
- [x] T049 [P] Actualizar `CLAUDE.md` con convenciones reales usadas durante la implementación (imports absolutos, naming, estructura de stores)

**Checkpoint final**: App funcional en todos los estados. PDF operativo. Mobile ✅. RLS verificado ✅. Constitución v1.0.0 cumplida.

---

## Dependencies & Execution Order

### Phase Dependencies

```
Phase 1 (Setup)
    └── Phase 2 (Foundational)  ← BLOQUEA todo lo demás
            ├── Phase 3 (US1 - Auth)
            │       ├── Phase 4 (US2 - Transactions)
            │       └── Phase 5 (US4 - Categories) [paralelo con Phase 4]
            │               └── Phase 6 (US3 - Dashboard) [requiere US2 + US4]
            │                       └── Phase 7 (US5 - PDF)
            │                               └── Phase 8 (Polish)
```

### User Story Dependencies

- **US1 (Auth)**: Después de Phase 2. Sin dependencias de otras US.
- **US2 (Transactions)**: Después de US1. Usa `category.store` (read-only, de Phase 2).
- **US4 (Categories)**: Después de US1. Puede ejecutarse en paralelo con US2 si hay dos developers.
- **US3 (Dashboard)**: Después de US2 Y US4 (necesita categorías para colores del gráfico).
- **US5 (PDF)**: Después de US3 (reutiliza el `dateRange` del Dashboard).

### Within Each User Story

- Tasks marcadas `[P]` dentro de la misma fase pueden ejecutarse en paralelo.
- Stores antes que componentes que los consumen.
- Componentes leaf antes que componentes contenedores.
- Páginas al final de cada US (integran todo).

### Parallel Opportunities

```bash
# Phase 1 — T002, T003, T005, T006 en paralelo (archivos diferentes)
# Phase 2 — T010, T011, T012 en paralelo (archivos diferentes)
# Phase 3 — T018, T019 en paralelo (LoginForm y RegisterForm son independientes)
# Phase 4 — T024, T025, T026 en paralelo (3 componentes, archivos diferentes)
# Phase 4 + Phase 5 — (si hay 2 developers) US2 y US4 en paralelo tras US1
# Phase 7 — T038 y T039 en paralelo (lib/pdf.ts y ExportPDFButton son independientes)
```

---

## Parallel Example: User Story 2 (Transactions CRUD)

```bash
# Una vez que T023 (transaction.store) está completo, lanzar en paralelo:
Task A: "Crear TransactionForm en src/components/transactions/TransactionForm.tsx"    # T024
Task B: "Crear TransactionFilters en src/components/transactions/TransactionFilters.tsx"  # T025
Task C: "Crear TransactionItem en src/components/transactions/TransactionItem.tsx"    # T026
# Luego (dependen de A, B, C):
Task D: "Crear TransactionList en src/components/transactions/TransactionList.tsx"    # T027
Task E: "Crear TransactionsPage en src/pages/TransactionsPage.tsx"                   # T028
```

---

## Implementation Strategy

### MVP First (User Story 1 solamente)

1. Completar Phase 1: Setup → `pnpm dev` funciona
2. Completar Phase 2: Foundational → DB lista, RLS activado, routing scaffold
3. Completar Phase 3: US1 → Login/Register funcional
4. **STOP y VALIDAR**: Registro, login, logout, rutas protegidas
5. Demo/deploy si es necesario

### Incremental Delivery

1. **Phase 1 + 2** → Infraestructura lista
2. **Phase 3 (US1)** → Auth funcional ✅ Demo
3. **Phase 4 (US2)** → CRUD de transacciones ✅ Demo
4. **Phase 5 (US4)** → Categorías propias ✅ Demo
5. **Phase 6 (US3)** → Dashboard con gráficos ✅ Demo
6. **Phase 7 (US5)** → Exportar PDF ✅ Constitución IV cumplida
7. **Phase 8** → Polish ✅ Release MVP

### Parallel Team Strategy (2 developers)

- Ambos completan Phase 1 + 2 juntos
- Una vez Phase 3 (US1) completa:
  - Dev A: Phase 4 (US2 — Transactions)
  - Dev B: Phase 5 (US4 — Categories)
- Ambos completan Phase 6 (US3 — Dashboard) juntos
- Dev A: Phase 7 (US5 — PDF)
- Dev B: Phase 8 (Polish — inicio)

---

## Task Count Summary

| Phase | Story | Tasks | Parallel |
|---|---|---|---|
| Phase 1: Setup | — | 6 | T002, T003, T005, T006 |
| Phase 2: Foundational | — | 10 | T010, T011, T012 |
| Phase 3: US1 Auth | US1 | 6 | T018, T019 |
| Phase 4: US2 Transactions | US2 | 6 | T024, T025, T026 |
| Phase 5: US4 Categories | US4 | 4 | T029, T030 |
| Phase 6: US3 Dashboard | US3 | 5 | T033, T034, T035, T036 |
| Phase 7: US5 PDF | US5 | 3 | T038, T039 |
| Phase 8: Polish | — | 9 | T042, T043, T045, T046, T049 |
| **TOTAL** | | **49** | **~20 paralelas** |

---

## Notes

- `[P]` = archivos diferentes, sin dependencias incompletas — se pueden ejecutar en paralelo
- `[USn]` label conecta cada tarea a su user story para trazabilidad
- No hay test tasks (fuera del scope del MVP — verificación manual)
- Cada checkpoint valida la user story de forma independiente antes de avanzar
- Principio I (RLS) se verifica en T048 con el procedimiento de `rls-policies.sql`
- pnpm siempre — nunca npm ni yarn
