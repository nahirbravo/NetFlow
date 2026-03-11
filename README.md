NetFlow 💸
App web para registrar y visualizar tus ingresos y gastos personales. Cada usuario tiene sus propios datos, protegidos con Row Level Security de Supabase.
Features

🔐 Auth completo — registro e inicio de sesión con Supabase Auth
💰 CRUD de transacciones — registrá ingresos y gastos con categoría, fecha y descripción
🏷️ Categorías mixtas — categorías predefinidas del sistema + posibilidad de crear las propias
📊 Dashboard visual — gráfico de torta por categoría con selector de rango de fechas
💼 Balance en tiempo real — ingresos totales, gastos totales y balance neto del período
📄 Exportación a PDF — descargá un reporte completo del período seleccionado
📱 Responsive — funciona en mobile y desktop


Stack
TecnologíaUsoReact + TypeScriptFrontendViteBundlerSupabaseBase de datos, Auth y RLSZustandEstado globalReact Hook Form + ZodFormularios y validaciónRechartsGráficosjsPDF + jspdf-autotableExportación PDFTailwind CSSEstilosNetlifyDeploy

Requisitos previos

Node.js 18+
Una cuenta en Supabase (gratis)


Setup local
1. Clonar el repositorio
bashgit clone https://github.com/nahirbravo/NetFlow.git
cd NetFlow
2. Instalar dependencias
bashnpm install
3. Configurar variables de entorno
Copiá el archivo de ejemplo y completá con tus credenciales de Supabase:
bashcp .env.example .env.local
Editá .env.local:
envVITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu-anon-key
Encontrás estos valores en Supabase → tu proyecto → Settings → API.
4. Configurar la base de datos
En el SQL Editor de Supabase, ejecutá las migrations en este orden:

supabase/migrations/001_profiles.sql
supabase/migrations/002_categories.sql
supabase/migrations/003_transactions.sql
supabase/migrations/004_rls_policies.sql
supabase/migrations/005_seed_categories.sql

5. Correr en desarrollo
bashnpm run dev
La app estará disponible en http://localhost:5173.

Variables de entorno
VariableDescripciónVITE_SUPABASE_URLURL de tu proyecto en SupabaseVITE_SUPABASE_ANON_KEYClave pública (anon key) de Supabase

⚠️ Nunca commitees el archivo .env.local. Está incluido en .gitignore.


Deploy en Netlify

Conectá el repo en netlify.com → Add new site → Import an existing project
Configurá el build:

Build command: npm run build
Publish directory: dist


Agregá las variables de entorno en Site configuration → Environment variables
Agregá también: SECRETS_SCAN_OMIT_KEYS = VITE_SUPABASE_URL,VITE_SUPABASE_ANON_KEY
Deploy 🚀

Cada git push a main triggerea un redeploy automático.

Estructura del proyecto
src/
├── components/       # Componentes reutilizables
│   ├── auth/         # LoginForm, RegisterForm
│   ├── dashboard/    # BalanceCard, ExpensePieChart, DateRangePicker
│   ├── transactions/ # TransactionList, TransactionForm, TransactionItem
│   └── categories/   # CategoryList, CategoryForm, CategoryBadge
├── pages/            # DashboardPage, TransactionsPage, CategoriesPage
├── stores/           # Zustand stores (auth, transactions, categories)
├── lib/              # supabase.ts, pdf.ts
└── types/            # TypeScript types
