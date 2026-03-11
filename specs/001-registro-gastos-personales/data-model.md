# Data Model: Registro de Gastos Personales — MVP

**Branch**: `001-registro-gastos-personales`
**Date**: 2026-03-10

---

## Entities

### 1. `profiles`

Perfil del usuario. Se crea automáticamente via trigger cuando un usuario se registra
en `auth.users`. Aislado por `user_id = auth.uid()` via RLS.

| Campo | Tipo | Nullable | Default | Descripción |
|---|---|---|---|---|
| `id` | `uuid` | NO | — | PK, FK → `auth.users.id` ON DELETE CASCADE |
| `email` | `text` | NO | — | Email del usuario (sincronizado desde auth) |
| `full_name` | `text` | SÍ | `null` | Nombre mostrado en PDF y navbar |
| `created_at` | `timestamptz` | NO | `now()` | Fecha de registro |

**Relaciones**: 1 profile → N categories, N transactions.

**Validation rules**:
- `email` debe ser válido (validado por Supabase Auth antes de inserción).
- `full_name` sin restricción de longitud mínima (puede ser null).

---

### 2. `categories`

Categorías de clasificación de transacciones. Pueden ser del sistema (`is_system = true`,
`user_id IS NULL`) o propias del usuario (`user_id = auth.uid()`).

| Campo | Tipo | Nullable | Default | Descripción |
|---|---|---|---|---|
| `id` | `uuid` | NO | `gen_random_uuid()` | PK |
| `user_id` | `uuid` | SÍ | `null` | FK → `auth.users.id` ON DELETE CASCADE; NULL = categoría del sistema |
| `name` | `text` | NO | — | Nombre de la categoría, max 50 chars |
| `color` | `text` | NO | `'#6366f1'` | Color hex `#RRGGBB`, usado en gráfico y badge |
| `icon` | `text` | NO | `'📂'` | Emoji icon, 1-2 caracteres |
| `is_system` | `boolean` | NO | `false` | `true` = categoría predefinida, no editable por usuarios |
| `created_at` | `timestamptz` | NO | `now()` | Fecha de creación |

**Relaciones**: 1 category → N transactions.

**Validation rules**:
- `name` mínimo 1 carácter, máximo 50. No puede ser vacío.
- `color` debe matchear `/^#[0-9A-Fa-f]{6}$/`. Default visible en el color picker.
- `icon` debe ser 1-2 chars (emoji). Validado en el frontend con Zod.
- Si `is_system = true` → `user_id IS NULL` (invariante, no se modifica via app).

**Estado de transición**: Las categorías propias (`is_system = false`) pueden
editarse y eliminarse. Las del sistema son read-only para el usuario.

**Seed data — 10 categorías del sistema**:

| name | color | icon |
|---|---|---|
| Alimentación | `#f97316` | 🍽️ |
| Transporte | `#3b82f6` | 🚗 |
| Vivienda | `#8b5cf6` | 🏠 |
| Salud | `#ef4444` | 💊 |
| Entretenimiento | `#ec4899` | 🎬 |
| Educación | `#06b6d4` | 📚 |
| Ropa | `#84cc16` | 👕 |
| Tecnología | `#6366f1` | 💻 |
| Viajes | `#f59e0b` | ✈️ |
| Otros | `#9ca3af` | 📦 |

---

### 3. `transactions`

Movimiento económico individual del usuario (ingreso o gasto).

| Campo | Tipo | Nullable | Default | Descripción |
|---|---|---|---|---|
| `id` | `uuid` | NO | `gen_random_uuid()` | PK |
| `user_id` | `uuid` | NO | — | FK → `auth.users.id` ON DELETE CASCADE |
| `amount` | `numeric(12,2)` | NO | — | Monto positivo. Siempre > 0. |
| `type` | `text` | NO | — | Enum: `'income'` o `'expense'` |
| `category_id` | `uuid` | SÍ | `null` | FK → `categories.id` ON DELETE SET NULL |
| `date` | `date` | NO | — | Fecha del movimiento (no timestamp) |
| `description` | `text` | SÍ | `null` | Descripción libre, max 255 chars |
| `created_at` | `timestamptz` | NO | `now()` | Fecha de creación del registro |
| `updated_at` | `timestamptz` | NO | `now()` | Última modificación (trigger) |

**Relaciones**: N transactions → 1 profile (via `user_id`), N transactions → 1 category (via `category_id`).

**Validation rules** (Zod en frontend + CHECK en DB):
- `amount > 0` — nunca negativo ni cero.
- `type IN ('income', 'expense')` — CHECK constraint.
- `date` requerida — no futura restriction en MVP.
- `amount` máximo 2 decimales — `NUMERIC(12,2)` en DB; `parseFloat(val).toFixed(2)` en frontend.
- `description` nullable, max 255 chars — validado en Zod con `.max(255).optional()`.

**State transitions**:

```
Draft (form) → Created (guardada en Supabase) → Updated → Deleted
                        ↑__________⟲___________|
```

Nota: no hay soft delete. Las eliminadas se borran permanentemente.

---

## Entity Relationships

```text
auth.users (Supabase Auth)
    │
    ├── 1:1 → profiles
    │
    ├── 1:N → categories (user_id IS NOT NULL = propias)
    │              │
    │              │ (user_id IS NULL = sistema, compartidas)
    │
    └── 1:N → transactions
                   │
                   └── N:1 → categories (category_id, nullable)
```

---

## Frontend TypeScript Types

```typescript
// src/types/database.types.ts

export type TransactionType = 'income' | 'expense'

export interface Profile {
  id: string
  email: string
  full_name: string | null
  created_at: string
}

export interface Category {
  id: string
  user_id: string | null
  name: string
  color: string
  icon: string
  is_system: boolean
  created_at: string
}

export interface Transaction {
  id: string
  user_id: string
  amount: number
  type: TransactionType
  category_id: string | null
  date: string // 'YYYY-MM-DD'
  description: string | null
  created_at: string
  updated_at: string
  // Joined fields (when fetching with category)
  category?: Pick<Category, 'id' | 'name' | 'color' | 'icon'>
}

// Store-level filter state
export interface TransactionFilters {
  type: TransactionType | 'all'
  category_id: string | 'all'
  date_from: string | null // 'YYYY-MM-DD'
  date_to: string | null   // 'YYYY-MM-DD'
}

// Form schemas (Zod)
export interface TransactionFormValues {
  amount: number
  type: TransactionType
  category_id: string
  date: string
  description?: string
}

export interface CategoryFormValues {
  name: string
  color: string
  icon: string
}
```

---

## Computed Values (frontend only)

Calculados en el frontend a partir de las transacciones filtradas. No se persisten
en la DB.

| Valor | Cálculo | Usado en |
|---|---|---|
| `totalIncome` | `transactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0)` | BalanceCard |
| `totalExpenses` | `transactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0)` | BalanceCard |
| `balance` | `totalIncome - totalExpenses` | BalanceCard |
| `expensesByCategory` | `groupBy(expenses, 'category_id')` → sum por categoría | ExpensePieChart |
| `recentTransactions` | `transactions.slice(0, 5)` (ordenadas por `date DESC`) | RecentTransactions |
| `paginatedTransactions` | `filtered.slice((page-1)*25, page*25)` | TransactionList |
| `totalPages` | `Math.ceil(filtered.length / 25)` | TransactionList |
