<!--
  SYNC IMPACT REPORT
  ==================
  Version change: [template placeholder] → 1.0.0
  Modified principles:
    - [PRINCIPLE_1_NAME] → I. Privacidad de Datos (inicial)
    - [PRINCIPLE_2_NAME] → II. Simplicidad ante Todo (inicial)
    - [PRINCIPLE_3_NAME] → III. Responsive First (inicial)
    - [PRINCIPLE_4_NAME] → IV. Soberanía de Datos del Usuario (inicial)
    - [PRINCIPLE_5_NAME] → ELIMINADO (el proyecto define 4 principios, no 5)
  Added sections:
    - Stack Tecnológico
    - Alcance del MVP
  Removed sections: ninguna (primera ratificación)
  Templates requiring updates:
    - .specify/templates/plan-template.md   ✅ sin cambios requeridos
    - .specify/templates/spec-template.md   ✅ sin cambios requeridos
    - .specify/templates/tasks-template.md  ✅ sin cambios requeridos
  Deferred TODOs: ninguno
-->

# Registro de Gastos Personales — Constitución

## Core Principles

### I. Privacidad de Datos

Los datos de cada usuario son completamente privados y aislados de los de cualquier
otro usuario.

- Los movimientos de un usuario NEVER deben ser visibles para otro usuario.
- Row Level Security (RLS) de Supabase MUST estar activado en **todas** las tablas
  que contengan datos de usuario.
- Ninguna consulta, endpoint ni componente puede acceder a datos de usuario sin
  autenticación activa y verificada.
- Las pruebas MUST incluir validación de que un usuario no puede leer ni modificar
  datos de otro usuario.

### II. Simplicidad ante Todo

La app MUST ser usable sin conocimientos contables y sin fricción perceptible.

- El flujo principal —registrar un movimiento— MUST completarse en menos de
  30 segundos desde que el usuario abre la pantalla.
- Los formularios MUST limitarse a los campos estrictamente necesarios; ningún campo
  opcional puede bloquear el flujo principal.
- Las interfaces complejas, asistentes multi-paso o terminología financiera técnica
  están prohibidas sin justificación explícita en el plan de la feature.

### III. Responsive First

La app MUST ser completamente funcional en dispositivos móviles.

- Toda pantalla MUST ser usable en viewports desde 320 px de ancho.
- El diseño se piensa mobile-first; las adaptaciones a desktop son mejoras
  incrementales, nunca la base de diseño.
- Los elementos táctiles (botones, inputs) MUST tener un área mínima de 44 × 44 px
  para garantizar usabilidad táctil.

### IV. Soberanía de Datos del Usuario

El usuario es el dueño exclusivo de sus datos y MUST poder exportarlos en cualquier
momento sin restricciones.

- La exportación en PDF MUST incluir el 100 % de los movimientos del usuario, sin
  paginación oculta ni pérdida de registros.
- Esta funcionalidad MUST estar disponible en el MVP; no puede diferirse a
  versiones posteriores.
- La app no vende, comparte ni analiza datos de usuarios para terceros bajo ningún
  concepto.

## Stack Tecnológico

Tecnologías definidas para el MVP. Cualquier cambio de stack MUST documentarse
como enmienda a esta constitución antes de implementarse.

| Área | Tecnología |
|---|---|
| Frontend | React 18 + Vite |
| Estilos | Tailwind CSS |
| Estado global | Zustand |
| Formularios | React Hook Form |
| Gráficos | Recharts |
| Base de datos + Auth | Supabase (PostgreSQL + Auth + RLS) |
| Exportar PDF | react-pdf o jsPDF (a definir en plan de feature) |

## Alcance del MVP

### Qué ES esta app

Una herramienta web para que cualquier persona registre ingresos y gastos personales,
visualice en qué gasta su dinero y exporte reportes en PDF. Cada usuario tiene sus
propios datos, completamente aislados de otros usuarios. MVP gratuito, sin publicidad.

### Qué NO ES esta app

- No es una app de contabilidad empresarial.
- No conecta con cuentas bancarias ni tarjetas.
- No hace proyecciones ni gestión de inversiones.
- No es un gestor de presupuestos por categoría.
- No tiene función social ni compartir datos entre usuarios.
- No tiene planes de pago en esta versión.

## Governance

Esta constitución es el documento rector del proyecto. Toda decisión de diseño o
arquitectura MUST poder justificarse contra al menos uno de los principios definidos
aquí.

**Procedimiento de enmienda:**

1. Identificar el principio o sección a modificar.
2. Documentar el motivo y el impacto (en el PR o commit que introduce la enmienda).
3. Incrementar la versión según semver:
   - MAJOR: eliminación o redefinición incompatible de un principio.
   - MINOR: nuevo principio o sección añadida.
   - PATCH: aclaraciones, correcciones de redacción, ajustes menores.
4. Actualizar `Last Amended`.
5. Propagar cambios a los templates afectados y documentarlo en el Sync Impact Report.

**Compliance:**

- Cada feature spec MUST referenciar el principio que justifica cada requisito.
- El Constitution Check en `plan-template.md` MUST validarse antes de Phase 0.
- Violaciones MUST documentarse en la tabla de Complexity Tracking del plan.

**Version**: 1.0.0 | **Ratified**: 2026-03-10 | **Last Amended**: 2026-03-10
