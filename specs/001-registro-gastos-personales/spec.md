# Feature Specification: Registro de Gastos Personales — MVP

**Feature Branch**: `001-registro-gastos-personales`
**Created**: 2026-03-10
**Status**: Draft
**Constitution**: v1.0.0

---

## User Scenarios & Testing *(mandatory)*

### User Story 1 — Autenticación (Priority: P1)

Como usuario nuevo, quiero registrarme con email y contraseña para tener
mi cuenta privada. Como usuario existente, quiero iniciar sesión para
acceder a mis datos.

**Why this priority**: Sin autenticación no existe el sistema. Es el
prerequisito de todos los demás flujos. Principio I (Privacidad de Datos).

**Independent Test**: Puedo abrir la app, registrarme con un email nuevo,
ver el dashboard vacío y cerrar sesión. El flujo entero funciona sin
ninguna otra feature completa.

**Acceptance Scenarios**:

1. **Given** usuario no autenticado, **When** accede a `/dashboard`,
   **Then** es redirigido a `/login`.
2. **Given** formulario de registro completo y válido, **When** envía,
   **Then** se crea la cuenta, inicia sesión automáticamente y ve el dashboard.
3. **Given** credenciales incorrectas, **When** intenta login, **Then**
   ve mensaje de error inline (no toast), el formulario no se resetea.
4. **Given** usuario autenticado, **When** hace clic en "Cerrar sesión",
   **Then** es redirigido a `/login` y no puede volver al dashboard con
   el botón atrás del navegador.

---

### User Story 2 — Registrar Movimiento (Priority: P1)

Como usuario autenticado, quiero registrar un ingreso o gasto en menos de
30 segundos para mantener mi registro al día sin fricción.

**Why this priority**: Es el core de la app. Sin esto no hay datos.
Principio II (Simplicidad ante Todo).

**Independent Test**: Con categorías del sistema seed ya cargadas, puedo
registrar un gasto de $500 en "Alimentación", verlo en la lista y que
el balance se actualice.

**Acceptance Scenarios**:

1. **Given** usuario en `/transactions`, **When** hace clic en "Nuevo
   movimiento", **Then** ve el formulario con: monto, tipo (ingreso/gasto),
   categoría, fecha (default hoy), descripción (opcional).
2. **Given** monto = 0 o vacío, **When** intenta guardar, **Then** ve
   error de validación y no se crea el registro.
3. **Given** formulario válido, **When** guarda, **Then** el movimiento
   aparece en la lista inmediatamente (sin reload).
4. **Given** movimiento existente, **When** hace clic en editar, **Then**
   el formulario se pre-llena y puede modificar cualquier campo.
5. **Given** movimiento existente, **When** hace clic en eliminar y confirma,
   **Then** desaparece de la lista y el balance se actualiza.

---

### User Story 3 — Ver Dashboard con resumen (Priority: P2)

Como usuario autenticado, quiero ver un resumen visual de mis ingresos,
gastos y balance del período seleccionado para entender en qué gasto mi dinero.

**Why this priority**: Es la razón principal por la que alguien usaría
la app sobre una planilla. Depende de User Stories 1 y 2 para tener datos.

**Independent Test**: Con al menos 2 transacciones cargadas (1 ingreso,
1 gasto en 2 categorías distintas), el dashboard muestra balances correctos
y el gráfico de torta se renderiza.

**Acceptance Scenarios**:

1. **Given** período con transacciones, **When** ve el dashboard, **Then**
   ve: total ingresos, total gastos, balance neto, gráfico de torta por
   categoría, y últimas 5 transacciones.
2. **Given** dashboard con período A, **When** cambia el rango de fechas
   a período B, **Then** todos los valores se actualizan sin recargar la página.
3. **Given** período sin transacciones, **When** ve el dashboard, **Then**
   ve estado vacío con mensaje amigable (no una pantalla en blanco ni errores).
4. **Given** gráfico de torta con categorías, **When** hace hover en una porción,
   **Then** ve nombre de categoría y monto (tooltip).

---

### User Story 4 — Gestionar Categorías (Priority: P2)

Como usuario autenticado, quiero ver las categorías predefinidas y agregar
las mías para clasificar mis movimientos según mi estilo de vida.

**Why this priority**: Mejora la usabilidad del registro de transacciones
y la riqueza del dashboard. Depende de User Story 1.

**Independent Test**: Puedo agregar una categoría "Mascota" con color
verde y emoji 🐾, verla en la lista, y luego eliminarla.

**Acceptance Scenarios**:

1. **Given** usuario en `/categories`, **When** ve la lista, **Then** ve
   las 10 categorías del sistema (no editables/eliminables) y las suyas propias.
2. **Given** formulario de nueva categoría con nombre, color y emoji, **When**
   guarda, **Then** aparece en la lista y queda disponible en el formulario
   de transacciones.
3. **Given** categoría propia, **When** hace clic en eliminar, **Then** se
   elimina. Las categorías del sistema no tienen botón de eliminar.

---

### User Story 5 — Exportar PDF (Priority: P3)

Como usuario autenticado, quiero descargar un PDF con todos mis movimientos
del período seleccionado para tenerlos fuera de la app.

**Why this priority**: Requisito de constitución (Principio IV, disponible
en MVP). Depende de User Stories 1, 2 y 3.

**Independent Test**: Con al menos 1 transacción en el período del dashboard,
puedo descargar un PDF que incluye: encabezado con datos del usuario y período,
resumen de ingresos/gastos/balance, y tabla completa de movimientos.

**Acceptance Scenarios**:

1. **Given** dashboard con transacciones en el período, **When** hace clic en
   "Exportar PDF", **Then** se descarga un archivo `.pdf` con nombre
   `gastos-YYYY-MM.pdf`.
2. **Given** PDF generado, **Then** contiene: nombre del usuario, período, fecha
   de exportación, ingresos totales, gastos totales, balance, y tabla con
   columnas: fecha | descripción | categoría | tipo | monto.
3. **Given** dashboard SIN transacciones en el período, **When** ve el botón,
   **Then** está deshabilitado (no dispara la generación).
4. **Given** PDF generado, **Then** contiene el 100% de las transacciones
   del período (sin paginación oculta).

---

### Edge Cases

- ¿Qué pasa si el usuario elimina una categoría que tiene transacciones
  asociadas? → `category_id` en `transactions` debe ser nullable o usar
  FK con `ON DELETE SET NULL`. La transacción permanece, categoría muestra
  "Sin categoría".
- ¿Qué pasa si el monto tiene más de 2 decimales? → Redondear a 2 decimales
  en el frontend antes de guardar.
- ¿Qué pasa si el período de fechas tiene from > to? → Error de validación
  inline, no se aplica el filtro.
- ¿Qué pasa si hay más de 1000 transacciones en el PDF? → jsPDF maneja
  múltiples páginas automáticamente con jspdf-autotable. Probar con 200+ filas.
- ¿Qué pasa si el usuario tiene sesión expirada y hace una acción? → Supabase
  devuelve error 401, el store captura el error, redirige a `/login`.

---

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Sistema MUST autenticar usuarios con email/contraseña via
  Supabase Auth. — *Principio I*
- **FR-002**: Sistema MUST aplicar RLS en tablas `profiles`, `categories`
  y `transactions`. — *Principio I*
- **FR-003**: Usuarios MUST poder registrar movimientos (monto, tipo, categoría,
  fecha, descripción opcional) en < 30 segundos. — *Principio II*
- **FR-004**: Sistema MUST validar: monto > 0, fecha requerida, categoría
  requerida. Campos opcionales NO bloquean el flujo. — *Principio II*
- **FR-005**: Sistema MUST mostrar categorías del sistema (seed) y permitir
  crear/editar/eliminar categorías propias. — *Principio II*
- **FR-006**: Sistema MUST mostrar dashboard con ingresos, gastos y balance
  del período seleccionado. — *Principio II*
- **FR-007**: Sistema MUST ser completamente funcional en viewports desde
  320 px de ancho. — *Principio III*
- **FR-008**: Elementos táctiles MUST tener área mínima 44 × 44 px. — *Principio III*
- **FR-009**: Sistema MUST generar PDF con 100% de las transacciones del período,
  sin paginación oculta. — *Principio IV*
- **FR-010**: Exportación PDF MUST estar disponible en el MVP. — *Principio IV*
- **FR-011**: Usuarios MUST poder filtrar transacciones por tipo, categoría
  y rango de fechas. — *Principio II*
- **FR-012**: Sistema MUST mostrar últimas 5 transacciones en el dashboard. — *Principio II*

### Key Entities

- **User** (via Supabase Auth): Representa al usuario autenticado. Datos
  de perfil en tabla `profiles`. Aislamiento por `user_id` en toda la DB.
- **Category**: Clasificador de transacciones. Puede ser del sistema (compartida,
  `user_id IS NULL`) o del usuario (privada, `user_id = auth.uid()`). Tiene
  nombre, color hex y emoji icon.
- **Transaction**: Movimiento económico del usuario. Tiene monto (> 0),
  tipo (ingreso/gasto), categoría (FK nullable), fecha y descripción opcional.
  Pertenece exclusivamente a un usuario.

---

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Un usuario puede registrar un movimiento completo (abrir formulario
  → completar campos → guardar → ver en lista) en menos de 30 segundos.
- **SC-002**: Un usuario que accede a `/dashboard` sin estar autenticado es
  redirigido a `/login` en menos de 200ms (sin flash de contenido).
- **SC-003**: El PDF exportado contiene exactamente el mismo número de
  transacciones que se muestran en pantalla para el período seleccionado.
- **SC-004**: La app es completamente usable en un iPhone SE (320px ancho)
  sin overflow horizontal ni elementos inaccesibles.
- **SC-005**: Un usuario no puede leer ni modificar transacciones de otro
  usuario, verificado con prueba manual de RLS (consulta directa a Supabase
  con JWT de otro usuario retorna 0 rows).
