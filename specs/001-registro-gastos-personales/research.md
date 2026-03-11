# Research: Registro de Gastos Personales — MVP

**Branch**: `001-registro-gastos-personales`
**Date**: 2026-03-10
**Status**: Complete — todos los NEEDS CLARIFICATION resueltos

---

## 1. PDF Generation: jsPDF + jspdf-autotable vs @react-pdf/renderer

**Decision**: jsPDF + jspdf-autotable

**Rationale**:
- `@react-pdf/renderer` añade ~1.2 MB gzipped al bundle (reportado en issues
  oficiales). Para un MVP personal eso es inaceptable.
- `jsPDF` (~300 KB minified) con `jspdf-autotable` es la solución estándar para
  generación de tablas en el browser.
- La API imperativa de jsPDF (`doc.autoTable(...)`) es más simple para tablas
  financieras que el modelo declarativo de react-pdf.
- Funciona en mobile browsers sin dependencias nativas.
- Ya listado en las dependencias del plan del usuario.

**Alternatives considered**:
- `@react-pdf/renderer`: descartado por bundle size (+1.2 MB gzipped).
- `pdfmake`: similar tamaño a jsPDF, menos ejemplos de integración con Vite.

---

## 2. Tailwind CSS v4 con @tailwindcss/vite

**Decision**: Tailwind CSS v4 con CSS-first configuration (sin `tailwind.config.js`)

**Rationale**:
- El plan del usuario ya incluye `@tailwindcss/vite` en dependencias, confirmando v4.
- Tailwind v4 usa configuración CSS-first via directiva `@theme {}` en el archivo CSS.
- `tailwind.config.js` es **opcional** en v4; no se necesita para el MVP.
- Setup en Vite: agregar plugin en `vite.config.ts` + `@import "tailwindcss"` en CSS.
- Content detection es automático en v4 (no se requiere array `content`).
- Builds 3-10x más rápidos que v3.

**Setup mínimo**:
```ts
// vite.config.ts
import tailwindcss from '@tailwindcss/vite'
export default { plugins: [tailwindcss()] }
```
```css
/* src/index.css */
@import "tailwindcss";
```

**Alternatives considered**:
- Tailwind v3: descartado porque el plan explícitamente lista `@tailwindcss/vite` (v4).

---

## 3. Paginación vs Scroll Infinito en TransactionList

**Decision**: Paginación simple (page-based)

**Rationale**:
- La lista tiene filtros (tipo, categoría, fecha) que resetean la posición al cambiar.
  Con scroll infinito, cambiar un filtro y volver arriba es confuso.
- Paginación permite que el usuario sepa cuántos movimientos existen en el período.
- Implementación más simple: no requiere Intersection Observer ni React Query.
- Para un MVP personal con < 1000 transacciones por usuario, la paginación de 20-25
  items por página es suficiente.
- Cuando los filtros cambian, el page reset a 1 es explícito y entendible.

**Implementation**: Estado local `page` en `TransactionsPage`. Slice de array del store
filtrado. Botones Anterior/Siguiente + "Página X de Y". 25 items por página.

**Alternatives considered**:
- Scroll infinito: descartado por complejidad con filtros y porque no aplica a listas
  de datos financieros donde el usuario quiere buscar un registro específico.
- React Query con `useInfiniteQuery`: overkill para MVP, añade dependencia extra.

---

## 4. DateRangePicker: Nativo vs Librería

**Decision**: Dos `<input type="date">` nativos con wrapper personalizado

**Rationale**:
- Para un DateRangePicker simple (fecha desde / hasta), el input nativo es suficiente.
- Cero dependencias adicionales.
- En iOS Safari, el input nativo abre el picker del sistema operativo, que es la
  experiencia más familiar para el usuario mobile.
- Las issues de iOS Safari reportadas afectan principalmente a date pickers de
  librería (problema de focus entre dos datepickers), no a inputs nativos simples.
- El único problema conocido es el VoiceOver bug de React + event delegation, que
  se mitiga no añadiendo `onClick` al wrapper del input.
- Styling via Tailwind (border, rounded, padding) es suficiente para MVP.

**Implementation**:
```tsx
<input type="date" className="border rounded-lg px-3 py-2 min-h-[44px]" />
```
Dos inputs: `dateFrom` y `dateTo`. Validación: si `dateFrom > dateTo`, mostrar error
inline y no aplicar el filtro.

**Alternatives considered**:
- `react-daterange-picker` (wojtekmaj): descartado para MVP, añade bundle ~45KB + CSS.
- `react-datepicker` (Hacker0x01): mismo problema + 71 KB minified.

---

## 5. Testing Framework

**Decision**: Testing explícitamente fuera del scope del MVP

**Rationale**:
- El plan del usuario en 6 fases no incluye ninguna tarea de testing.
- La constitución indica que las pruebas DEBEN incluir validación de RLS, pero
  no especifica si es testing automatizado o prueba manual.
- Para MVP: verificación manual de RLS con Supabase Table Editor + JWT de otro usuario.
- Post-MVP: vitest + @testing-library/react es el estándar para Vite + React.

**Constitution compliance**: SC-005 se verifica manualmente en Supabase Dashboard
(SQL editor con `SET request.jwt.claim.sub = 'other-user-id'`).

**Deferred**: Agregar vitest como primera tarea post-MVP.

---

## 6. Auth Method

**Decision**: Supabase Auth con email/password únicamente

**Rationale**: Ya definido en el plan. SSO/OAuth fuera del scope del MVP.
Magic link podría añadirse post-MVP como Principio II improvement.

---

## 7. Estado Global: Zustand Architecture

**Decision**: Un store por dominio, sin middleware innecesario

**Rationale**:
- `useAuthStore`: sesión, user, loading state
- `useCategoryStore`: lista de categorías (sistema + propias), CRUD ops
- `useTransactionStore`: lista de transacciones, filtros, CRUD ops

Sin `persist` middleware en stores de datos (Supabase es la fuente de verdad).
`persist` solo si se decide cachear para offline (fuera del scope MVP).

---

## Resumen de decisiones

| Pregunta | Decisión | Prioridad |
|---|---|---|
| PDF library | jsPDF + jspdf-autotable | Fase 5 |
| Tailwind version | v4 CSS-first | Fase 1 |
| Lista de transacciones | Paginación simple (25/página) | Fase 3 |
| DateRangePicker | Inputs nativos `type="date"` | Fase 3/4 |
| Testing | Manual (MVP), vitest post-MVP | Post-MVP |
| Auth | Supabase email/password | Fase 1 |
| Zustand | Un store por dominio | Fase 1–3 |
