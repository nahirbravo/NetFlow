import { Link } from 'react-router-dom'

function MockDashboard() {
  return (
    <div className="bg-gray-900 rounded-3xl p-6 w-full max-w-sm shadow-2xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <span className="text-xs font-medium text-gray-400 uppercase tracking-widest">Marzo 2026</span>
        <span className="text-xs text-gray-500">NetFlow</span>
      </div>

      {/* Balance */}
      <div className="mb-6">
        <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Balance</p>
        <p className="text-4xl font-bold text-white tracking-tight">$124.500</p>
        <p className="text-xs text-emerald-400 mt-1">▲ positivo este mes</p>
      </div>

      {/* Metrics row */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="bg-white/5 rounded-2xl p-3">
          <p className="text-xs text-gray-500 mb-1">Ingresos</p>
          <p className="text-lg font-semibold text-white">$210.000</p>
        </div>
        <div className="bg-white/5 rounded-2xl p-3">
          <p className="text-xs text-gray-500 mb-1">Gastos</p>
          <p className="text-lg font-semibold text-white">$85.500</p>
        </div>
      </div>

      {/* Mini transaction list */}
      <div className="space-y-2">
        {[
          { label: 'Comida', amount: '-$3.200', color: 'text-red-400' },
          { label: 'Freelance', amount: '+$50.000', color: 'text-emerald-400' },
          { label: 'Transporte', amount: '-$1.800', color: 'text-red-400' },
        ].map((t) => (
          <div key={t.label} className="flex items-center justify-between py-1.5">
            <span className="text-xs text-gray-400">{t.label}</span>
            <span className={`text-xs font-medium ${t.color}`}>{t.amount}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#f8f9fb]">
      {/* Navbar */}
      <header className="border-b border-gray-100 bg-white/80 backdrop-blur-md sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <span className="text-base font-semibold text-gray-900 tracking-tight">NetFlow</span>
          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors"
            >
              Iniciar sesión
            </Link>
            <Link
              to="/register"
              className="text-sm font-medium bg-gray-900 hover:bg-gray-800 text-white px-4 py-2 rounded-xl transition-colors"
            >
              Empezar gratis
            </Link>
          </div>
        </div>
      </header>

      {/* Hero — asimétrico */}
      <section className="flex-1 max-w-6xl mx-auto px-6 py-12 sm:py-20 w-full">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          {/* Left — copy */}
          <div className="flex-1 max-w-xl">
            <span className="inline-block text-xs font-semibold text-gray-400 uppercase tracking-widest mb-6 border border-gray-200 bg-white px-3 py-1 rounded-full">
              Finanzas personales
            </span>

            <h1 className="text-4xl sm:text-6xl font-bold text-gray-900 leading-[1.1] tracking-tight">
              Sabé exactamente
              <br />
              <span className="text-gray-300">a dónde va</span>
              <br />
              tu plata.
            </h1>

            <p className="mt-6 text-base text-gray-500 leading-relaxed">
              Registrá ingresos y gastos, visualizá tus hábitos y exportá reportes PDF.
              Sin complicaciones, sin cuentas bancarias conectadas, sin publicidad.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row gap-3">
              <Link
                to="/register"
                className="bg-gray-900 hover:bg-gray-800 text-white font-medium px-7 py-3.5 rounded-xl transition-colors text-sm text-center"
              >
                Crear cuenta gratis
              </Link>
              <Link
                to="/login"
                className="border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 font-medium px-7 py-3.5 rounded-xl transition-colors text-sm text-center"
              >
                Ya tengo cuenta →
              </Link>
            </div>

            <p className="mt-5 text-xs text-gray-400">Gratis. Sin tarjeta. Sin límites.</p>
          </div>

          {/* Right — mock (oculto en mobile, visible en lg+) */}
          <div className="hidden lg:flex w-full lg:w-auto justify-end">
            <MockDashboard />
          </div>
        </div>
      </section>

      {/* Features — bento grid */}
      <section className="max-w-6xl mx-auto px-6 pb-24 w-full">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 auto-rows-fr">

          {/* Card grande — registro rápido */}
          <div className="bg-white rounded-3xl shadow-sm p-8 lg:col-span-2 flex flex-col justify-between min-h-[200px]">
            <div>
              <h3 className="text-xl font-bold text-gray-900">Registrá en segundos</h3>
              <p className="mt-2 text-sm text-gray-500 leading-relaxed max-w-md">
                El flujo para agregar un movimiento está diseñado para que no te lleve más de 30 segundos.
                Monto, categoría, fecha — y listo.
              </p>
            </div>
            <div className="mt-6 flex gap-2">
              {['Comida', 'Transporte', 'Trabajo', 'Casa'].map((tag) => (
                <span key={tag} className="text-xs text-gray-500 bg-gray-50 border border-gray-100 px-3 py-1 rounded-full">
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Card — privacidad */}
          <div className="bg-gray-900 rounded-3xl shadow-sm p-8 text-white flex flex-col justify-between min-h-[200px]">
            <div>
              <h3 className="text-xl font-bold">Solo tus datos</h3>
              <p className="mt-2 text-sm text-gray-400 leading-relaxed">
                Aislamiento total. Nadie más accede a tu información.
              </p>
            </div>
          </div>

          {/* Card — PDF */}
          <div className="bg-white rounded-3xl shadow-sm p-8 flex flex-col justify-between min-h-[200px]">
            <div>
              <h3 className="text-xl font-bold text-gray-900">Exportá en PDF</h3>
              <p className="mt-2 text-sm text-gray-500 leading-relaxed">
                Reporte completo de cualquier período, cuando quieras.
              </p>
            </div>
          </div>

          {/* Card — dashboard */}
          <div className="bg-white rounded-3xl shadow-sm p-8 lg:col-span-2 flex flex-col justify-between min-h-[200px]">
            <div>
              <h3 className="text-xl font-bold text-gray-900">Dashboard visual</h3>
              <p className="mt-2 text-sm text-gray-500 leading-relaxed max-w-md">
                Gráfico de gastos por categoría, balance del período y últimos movimientos.
                Todo en una pantalla, sin ruido.
              </p>
            </div>
            <div className="mt-6 flex items-end gap-1 h-10">
              {[40, 70, 55, 90, 65, 80, 45].map((h, i) => (
                <div
                  key={i}
                  className="flex-1 bg-gray-900 rounded-sm opacity-80"
                  style={{ height: `${h}%` }}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA final */}
      <section className="max-w-6xl mx-auto px-6 pb-24 w-full">
        <div className="bg-gray-900 rounded-3xl p-12 text-center">
          <h2 className="text-3xl font-bold text-white tracking-tight">
            Empezá ahora, es gratis.
          </h2>
          <p className="mt-3 text-gray-400 text-sm">Sin tarjeta. Sin sorpresas.</p>
          <Link
            to="/register"
            className="inline-block mt-8 bg-white hover:bg-gray-100 text-gray-900 font-medium px-8 py-3.5 rounded-xl transition-colors text-sm"
          >
            Crear mi cuenta
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-6 px-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <span className="text-sm font-semibold text-gray-400">NetFlow</span>
          <span className="text-xs text-gray-300">{new Date().getFullYear()}</span>
        </div>
      </footer>
    </div>
  )
}
