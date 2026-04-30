import { useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export default function LandingPage() {
  const { user } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (user) navigate('/album', { replace: true })
  }, [user, navigate])

  return (
    <div className="min-h-screen bg-gray-950 overflow-x-hidden">
      <Nav />
      <Hero />
      <Features />
      <HowItWorks />
      <FinalCTA />
      <Footer />
    </div>
  )
}

/* ── Nav ─────────────────────────────────────────────────────── */
function Nav() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 bg-gray-950/80 backdrop-blur-md border-b border-white/5">
      <div className="flex items-center gap-2">
        <span className="text-2xl">⚽</span>
        <span className="font-bold text-white text-lg tracking-tight">Mundial 2026</span>
      </div>
      <div className="flex items-center gap-3">
        <Link to="/login" className="text-gray-400 hover:text-white text-sm font-medium transition-colors">
          Iniciar sesión
        </Link>
        <Link
          to="/register"
          className="bg-green-600 hover:bg-green-500 text-white text-sm font-semibold px-4 py-2 rounded-full transition-colors"
        >
          Registrate gratis
        </Link>
      </div>
    </nav>
  )
}

/* ── Hero ────────────────────────────────────────────────────── */
function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-green-600/10 rounded-full blur-[120px]" />
        <div className="absolute top-1/2 left-1/4 w-[300px] h-[300px] bg-emerald-500/8 rounded-full blur-[80px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[250px] h-[250px] bg-green-400/6 rounded-full blur-[80px]" />
      </div>

      {/* Floating stickers */}
      <FloatingStickers />

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 bg-green-900/40 border border-green-700/50 text-green-400 text-xs font-semibold px-4 py-1.5 rounded-full mb-6 animate-fade-in">
          <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
          FIFA World Cup 2026™ · 980 figuritas · 48 equipos
        </div>

        <h1 className="text-5xl sm:text-6xl md:text-7xl font-black text-white leading-tight mb-6 animate-slide-up">
          Tu álbum
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-300">
            digital
          </span>{' '}
          del Mundial
        </h1>

        <p className="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed animate-slide-up delay-100">
          Marcá las figuritas que tenés, descubrí las que te faltan y encontrá automáticamente posibles intercambios con tus amigos.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up delay-200">
          <Link
            to="/register"
            className="w-full sm:w-auto bg-green-600 hover:bg-green-500 text-white font-bold text-lg px-8 py-4 rounded-2xl transition-all hover:scale-105 hover:shadow-xl hover:shadow-green-900/40"
          >
            Empezar gratis →
          </Link>
          <Link
            to="/login"
            className="w-full sm:w-auto bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold text-lg px-8 py-4 rounded-2xl transition-all"
          >
            Ya tengo cuenta
          </Link>
        </div>

        {/* Stats */}
        <div className="flex items-center justify-center gap-8 mt-14 animate-fade-in delay-300">
          {[
            { value: '980', label: 'figuritas' },
            { value: '48', label: 'equipos' },
            { value: '12', label: 'grupos' },
          ].map(s => (
            <div key={s.label} className="text-center">
              <p className="text-2xl font-black text-white">{s.value}</p>
              <p className="text-xs text-gray-600 uppercase tracking-widest mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ── Floating 3D sticker cards ───────────────────────────────── */
const STICKER_DATA = [
  { id: 'ARG1', team: 'ARG', flag: '🇦🇷', color: 'from-sky-600 to-sky-400', delay: '0s', x: '-38%', y: '-20%', rot: '-15deg' },
  { id: 'BRA1', team: 'BRA', flag: '🇧🇷', color: 'from-yellow-600 to-yellow-400', delay: '0.4s', x: '38%', y: '-25%', rot: '12deg' },
  { id: 'FRA1', team: 'FRA', flag: '🇫🇷', color: 'from-blue-700 to-blue-500', delay: '0.8s', x: '-45%', y: '20%', rot: '8deg' },
  { id: 'ESP1', team: 'ESP', flag: '🇪🇸', color: 'from-red-700 to-red-500', delay: '1.2s', x: '42%', y: '15%', rot: '-10deg' },
  { id: 'GER1', team: 'GER', flag: '🇩🇪', color: 'from-gray-600 to-gray-400', delay: '1.6s', x: '0%', y: '-45%', rot: '5deg' },
  { id: 'POR1', team: 'POR', flag: '🇵🇹', color: 'from-rose-700 to-rose-500', delay: '2s', x: '20%', y: '38%', rot: '-18deg' },
]

function FloatingStickers() {
  return (
    <div className="absolute inset-0 pointer-events-none" style={{ perspective: '800px' }}>
      {STICKER_DATA.map(s => (
        <div
          key={s.id}
          className="absolute top-1/2 left-1/2"
          style={{
            transform: `translate(calc(-50% + ${s.x}), calc(-50% + ${s.y}))`,
            animationDelay: s.delay,
          }}
        >
          <StickerCard3D flag={s.flag} id={s.id} color={s.color} rot={s.rot} delay={s.delay} />
        </div>
      ))}
    </div>
  )
}

function StickerCard3D({ flag, id, color, rot, delay }: { flag: string; id: string; color: string; rot: string; delay: string }) {
  const cardRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const card = cardRef.current
    if (!card) return
    let frame: number
    let t = Math.random() * Math.PI * 2

    function animate() {
      t += 0.008
      const floatY = Math.sin(t) * 10
      const floatX = Math.cos(t * 0.7) * 5
      const rotY = Math.sin(t * 0.5) * 20
      card!.style.transform = `rotateZ(${rot}) rotateY(${rotY}deg) translateY(${floatY}px) translateX(${floatX}px)`
      frame = requestAnimationFrame(animate)
    }
    animate()
    return () => cancelAnimationFrame(frame)
  }, [rot])

  return (
    <div
      ref={cardRef}
      className="opacity-0 animate-sticker-appear"
      style={{
        animationDelay: delay,
        animationFillMode: 'forwards',
        transformStyle: 'preserve-3d',
        willChange: 'transform',
      }}
    >
      <div
        className={`w-16 h-20 sm:w-20 sm:h-24 rounded-xl bg-gradient-to-br ${color} shadow-2xl flex flex-col items-center justify-center border border-white/20 backdrop-blur-sm`}
        style={{ transformStyle: 'preserve-3d' }}
      >
        <span className="text-2xl sm:text-3xl">{flag}</span>
        <span className="text-white/80 text-[9px] font-mono font-bold mt-1">{id}</span>
        <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-white/10 to-transparent" />
      </div>
    </div>
  )
}

/* ── Features ────────────────────────────────────────────────── */
const FEATURES = [
  {
    icon: '📖',
    title: 'Marcá tus figuritas',
    desc: 'Tocá cualquier figurita para marcarla como obtenida. El álbum se actualiza en tiempo real en todos tus dispositivos.',
    accent: 'border-green-700/50 hover:border-green-600',
    glow: 'bg-green-900/20',
  },
  {
    icon: '🔍',
    title: 'Descubrí qué te falta',
    desc: 'Lista automática de faltantes organizada por equipo. Copiala con un click para compartirla donde quieras.',
    accent: 'border-blue-700/50 hover:border-blue-600',
    glow: 'bg-blue-900/20',
  },
  {
    icon: '🔄',
    title: 'Intercambios automáticos',
    desc: 'Agregá amigos por su @usuario y el sistema calcula automáticamente qué figuritas pueden intercambiar.',
    accent: 'border-purple-700/50 hover:border-purple-600',
    glow: 'bg-purple-900/20',
  },
  {
    icon: '📊',
    title: 'Seguí tu progreso',
    desc: 'Barra de progreso con porcentaje de completado. Saber cuánto te falta nunca fue tan fácil.',
    accent: 'border-yellow-700/50 hover:border-yellow-600',
    glow: 'bg-yellow-900/20',
  },
]

function Features() {
  return (
    <section className="py-24 px-4 max-w-6xl mx-auto">
      <div className="text-center mb-16">
        <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">
          Todo lo que necesitás
        </h2>
        <p className="text-gray-500 text-lg max-w-xl mx-auto">
          Una app diseñada para que completar el álbum sea más fácil y divertido.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 gap-5">
        {FEATURES.map(f => (
          <div
            key={f.title}
            className={`relative group bg-gray-900 rounded-2xl border ${f.accent} p-6 transition-all duration-300 hover:-translate-y-1 overflow-hidden`}
          >
            <div className={`absolute inset-0 ${f.glow} opacity-0 group-hover:opacity-100 transition-opacity`} />
            <div className="relative z-10">
              <span className="text-3xl">{f.icon}</span>
              <h3 className="text-lg font-bold text-white mt-3 mb-2">{f.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{f.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

/* ── How it works ────────────────────────────────────────────── */
const STEPS = [
  { n: '01', title: 'Creá tu cuenta', desc: 'Registrate con email o Google y elegí tu @usuario único.' },
  { n: '02', title: 'Marcá tus figuritas', desc: 'Abrí el álbum y tocá cada figurita que tenés para marcarla.' },
  { n: '03', title: 'Agregá amigos', desc: 'Buscá a tus amigos por su @usuario y enviá una solicitud.' },
  { n: '04', title: '¡Intercambiá!', desc: 'Ves automáticamente qué les podés dar y qué les podés pedir.' },
]

function HowItWorks() {
  return (
    <section className="py-24 px-4 bg-gray-900/40">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">Cómo funciona</h2>
          <p className="text-gray-500 text-lg">En 4 pasos simples</p>
        </div>

        <div className="grid sm:grid-cols-2 gap-6">
          {STEPS.map((step, i) => (
            <div key={step.n} className="flex gap-4 items-start">
              <div className="shrink-0 w-12 h-12 rounded-xl bg-green-900/60 border border-green-700/50 flex items-center justify-center">
                <span className="text-green-400 font-black text-sm">{step.n}</span>
              </div>
              <div>
                <h3 className="font-bold text-white mb-1">{step.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{step.desc}</p>
              </div>
              {i < STEPS.length - 1 && (
                <div className="hidden" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ── Final CTA ───────────────────────────────────────────────── */
function FinalCTA() {
  return (
    <section className="py-32 px-4 text-center relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-green-600/8 rounded-full blur-[100px]" />
      </div>
      <div className="relative z-10 max-w-2xl mx-auto">
        <span className="text-6xl">🏆</span>
        <h2 className="text-3xl sm:text-5xl font-black text-white mt-6 mb-4">
          ¿Listo para completar el álbum?
        </h2>
        <p className="text-gray-400 text-lg mb-10">
          Es gratis, funciona en cualquier dispositivo y tus datos se sincronizan automáticamente.
        </p>
        <Link
          to="/register"
          className="inline-block bg-green-600 hover:bg-green-500 text-white font-bold text-xl px-10 py-5 rounded-2xl transition-all hover:scale-105 hover:shadow-2xl hover:shadow-green-900/50"
        >
          Empezar ahora →
        </Link>
      </div>
    </section>
  )
}

/* ── Footer ──────────────────────────────────────────────────── */
function Footer() {
  return (
    <footer className="border-t border-gray-800 py-8 px-4 text-center">
      <div className="flex items-center justify-center gap-2 mb-2">
        <span className="text-xl">⚽</span>
        <span className="font-bold text-gray-400">Mundial 2026</span>
      </div>
      <p className="text-gray-700 text-xs">
        App no oficial. FIFA World Cup 2026™ es marca registrada de FIFA.
      </p>
    </footer>
  )
}
