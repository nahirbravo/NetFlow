# Quickstart: Registro de Gastos Personales — MVP

**Branch**: `001-registro-gastos-personales`
**Date**: 2026-03-10

---

## Prerrequisitos

- Node.js 20+
- pnpm 9+
- Cuenta en [supabase.com](https://supabase.com) (plan Free es suficiente)

---

## 1. Inicializar el proyecto

```bash
# Crear el proyecto Vite + React + TypeScript
pnpm create vite@latest . -- --template react-ts

# Instalar dependencias
pnpm add \
  @supabase/supabase-js \
  zustand \
  react-router-dom \
  react-hook-form \
  @hookform/resolvers \
  zod \
  recharts \
  jspdf \
  jspdf-autotable

# Instalar Tailwind v4 (incluyendo el plugin de Vite)
pnpm add -D tailwindcss @tailwindcss/vite

# Instalar types
pnpm add -D @types/jspdf-autotable
```

---

## 2. Configurar Tailwind v4

**`vite.config.ts`** — agregar el plugin:
```ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
})
```

**`src/index.css`** — reemplazar todo el contenido con:
```css
@import "tailwindcss";
```

> No se necesita `tailwind.config.js` ni `postcss.config.js` con Tailwind v4 + plugin de Vite.

---

## 3. Configurar Supabase

1. Ir a [supabase.com](https://supabase.com) → **New project**
2. Elegir nombre: `gastos-app`, región más cercana, contraseña para la DB
3. Esperar ~2 min a que el proyecto se inicialice
4. Ir a **Project Settings → API**:
   - Copiar **Project URL** → `VITE_SUPABASE_URL`
   - Copiar **anon/public key** → `VITE_SUPABASE_ANON_KEY`

---

## 4. Variables de entorno

Crear `.env.local` en la raíz del proyecto:

```env
VITE_SUPABASE_URL=https://xxxxxxxxxxxxxxxxxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

> `.env.local` está en `.gitignore`. Nunca commitear valores reales.

Crear `.env.example` (sí se commitea):
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

---

## 5. Ejecutar migrations en Supabase

1. Ir a **SQL Editor** en el Dashboard de Supabase → **New query**
2. Copiar y ejecutar el contenido de:
   - `specs/001-registro-gastos-personales/contracts/supabase-schema.sql`
   - `specs/001-registro-gastos-personales/contracts/rls-policies.sql`

> Ejecutar en ese orden. El schema.sql incluye el seed de las 10 categorías del sistema.

**Verificar**: Ir a **Table Editor** → deberías ver las tablas `profiles`, `categories`
(con 10 filas de seed), `transactions` (vacía).

---

## 6. Crear cliente de Supabase

**`src/lib/supabase.ts`**:
```ts
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
```

---

## 7. Correr el servidor de desarrollo

```bash
pnpm dev
```

Navegar a `http://localhost:5173`.

---

## 8. Verificar RLS (manual — Principio I)

Para verificar que un usuario no puede ver datos de otro:

1. Crear dos usuarios via la app (register) con emails distintos
2. Loguear con el usuario A y crear 2-3 transacciones
3. Ir a Supabase Dashboard → **SQL Editor** y ejecutar:

```sql
-- Obtener el UUID del usuario B (el que NO debe ver los datos del A)
SELECT id FROM auth.users WHERE email = 'usuario-b@ejemplo.com';

-- Simular sesión del usuario B
SET request.jwt.claims = '{"sub": "UUID-DE-USUARIO-B-AQUI"}';

-- Esta query debe retornar 0 filas
SELECT * FROM public.transactions;
```

Si el resultado es 0 filas, RLS está correctamente configurado. ✅

---

## Scripts disponibles

```bash
pnpm dev          # Servidor de desarrollo (HMR)
pnpm build        # Build de producción (dist/)
pnpm preview      # Preview del build de producción
```

---

## Estructura del proyecto (referencia)

```text
src/
├── components/     # Componentes reutilizables por dominio
├── pages/          # Páginas (LoginPage, DashboardPage, etc.)
├── stores/         # Zustand stores (auth, category, transaction)
├── lib/            # Clientes externos (supabase.ts, pdf.ts)
├── types/          # TypeScript types (database.types.ts)
├── App.tsx         # Router config
├── main.tsx        # Entry point
└── index.css       # @import "tailwindcss"
```
