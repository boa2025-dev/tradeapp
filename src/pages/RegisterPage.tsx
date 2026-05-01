import { useState, FormEvent, useEffect } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { getUserByUsername, sendFriendRequest } from '../lib/firestore'

export default function RegisterPage() {
  const { register, loginWithGoogle, finishGoogleSetup, pendingGoogleUser, user } = useAuth()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const isGoogleFlow = searchParams.get('google') === '1' || Boolean(pendingGoogleUser)
  const refUsername = searchParams.get('ref') ?? ''

  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const [refModal, setRefModal] = useState(false)
  const [refAdding, setRefAdding] = useState(false)
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)

  // If user navigated here with ?google=1 but there's no pending Google user, send to login
  useEffect(() => {
    if (searchParams.get('google') === '1' && !pendingGoogleUser) {
      navigate('/login', { replace: true })
    }
  }, [pendingGoogleUser, searchParams, navigate])

  function afterRegister() {
    if (refUsername) {
      setRefModal(true)
    } else {
      navigate('/album')
    }
  }

  async function handleGoogleUsernameSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await finishGoogleSetup(username)
      afterRegister()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error')
    } finally {
      setLoading(false)
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    if (password !== confirm) { setError('Las contraseñas no coinciden.'); return }
    if (password.length < 6) { setError('La contraseña debe tener al menos 6 caracteres.'); return }
    setLoading(true)
    try {
      await register(email, password, username)
      afterRegister()
    } catch (err) {
      const msg = err instanceof Error ? err.message : ''
      setError(msg.includes('email-already-in-use') ? 'Ese correo ya está registrado.' : msg || 'Error al registrarse.')
    } finally {
      setLoading(false)
    }
  }

  async function handleAddRef() {
    setRefAdding(true)
    try {
      const refUid = await getUserByUsername(refUsername.toLowerCase())
      if (refUid && user) await sendFriendRequest(user.uid, refUid)
    } finally {
      setRefAdding(false)
      navigate('/album')
    }
  }

  async function handleGoogle() {
    setError('')
    setGoogleLoading(true)
    try {
      const { needsUsername } = await loginWithGoogle()
      if (needsUsername) {
        navigate(refUsername ? `/register?google=1&ref=${refUsername}` : '/register?google=1')
      } else {
        afterRegister()
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : ''
      if (!msg.includes('popup-closed') && !msg.includes('cancelled-popup')) {
        setError(msg || 'Error al continuar con Google.')
      }
    } finally {
      setGoogleLoading(false)
    }
  }

  // Referral modal
  if (refModal) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-950 px-4">
        <div className="w-full max-w-sm bg-gray-900 rounded-2xl border border-green-800 p-6 space-y-5 text-center">
          <span className="text-5xl">🤝</span>
          <div>
            <h2 className="text-xl font-bold text-white">¡Te invitó un amigo!</h2>
            <p className="text-gray-400 text-sm mt-2">
              <span className="text-green-400 font-semibold">@{refUsername}</span> te invitó a TradeApp.
              ¿Querés agregarlo como amigo para ver intercambios de figuritas?
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <button
              onClick={handleAddRef}
              disabled={refAdding}
              className="w-full bg-green-700 hover:bg-green-600 disabled:bg-gray-700 text-white font-bold py-3 rounded-xl transition-colors"
            >
              {refAdding ? 'Agregando...' : `Sí, agregar a @${refUsername}`}
            </button>
            <button
              onClick={() => navigate('/album')}
              className="w-full bg-gray-800 hover:bg-gray-700 text-gray-300 font-semibold py-2.5 rounded-xl transition-colors text-sm"
            >
              Ahora no
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Google flow: only ask for username
  if (isGoogleFlow && pendingGoogleUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-950 px-4">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <span className="text-5xl">⚽</span>
            <h1 className="text-2xl font-bold text-white mt-3">Mundial 2026</h1>
          </div>
          <form onSubmit={handleGoogleUsernameSubmit} className="bg-gray-900 rounded-2xl border border-gray-800 p-6 space-y-4">
            <div>
              <h2 className="text-lg font-semibold text-white">Elegí tu nombre de usuario</h2>
              <p className="text-gray-500 text-sm mt-1">
                Cuenta de Google: <span className="text-gray-300">{pendingGoogleUser.email}</span>
              </p>
            </div>

            {error && (
              <div className="bg-red-900/40 border border-red-800 text-red-300 text-sm rounded-lg px-3 py-2">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm text-gray-400 mb-1">Nombre de usuario</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">@</span>
                <input
                  type="text"
                  value={username}
                  onChange={e => setUsername(e.target.value.toLowerCase())}
                  required
                  maxLength={20}
                  pattern="[a-z0-9_]+"
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-7 pr-3 py-2 text-white text-sm focus:outline-none focus:border-green-600 transition-colors"
                  placeholder="minombre"
                  autoFocus
                />
              </div>
              <p className="text-xs text-gray-600 mt-1">Solo letras, números y guiones bajos. Mín. 3 caracteres.</p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-700 hover:bg-green-600 disabled:bg-gray-700 disabled:text-gray-500 text-white font-semibold py-2.5 rounded-lg transition-colors"
            >
              {loading ? 'Guardando...' : 'Confirmar y entrar'}
            </button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950 px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <span className="text-5xl">⚽</span>
          <h1 className="text-2xl font-bold text-white mt-3">Mundial 2026</h1>
          <p className="text-gray-500 text-sm mt-1">Tu álbum de figuritas</p>
        </div>

        <div className="bg-gray-900 rounded-2xl border border-gray-800 p-6 space-y-4">
          <h2 className="text-lg font-semibold text-white">Crear cuenta</h2>

          {error && (
            <div className="bg-red-900/40 border border-red-800 text-red-300 text-sm rounded-lg px-3 py-2">
              {error}
            </div>
          )}

          {/* Google button */}
          <button
            type="button"
            onClick={handleGoogle}
            disabled={googleLoading || loading}
            className="w-full flex items-center justify-center gap-3 bg-white hover:bg-gray-100 disabled:bg-gray-300 text-gray-800 font-semibold py-2.5 rounded-lg transition-colors"
          >
            {googleLoading ? (
              <span className="animate-spin rounded-full h-4 w-4 border-2 border-gray-400 border-t-transparent" />
            ) : (
              <GoogleIcon />
            )}
            Continuar con Google
          </button>

          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-gray-800" />
            <span className="text-xs text-gray-600">o con email</span>
            <div className="flex-1 h-px bg-gray-800" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Nombre de usuario</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">@</span>
                <input
                  type="text"
                  value={username}
                  onChange={e => setUsername(e.target.value.toLowerCase())}
                  required
                  maxLength={20}
                  pattern="[a-z0-9_]+"
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-7 pr-3 py-2 text-white text-sm focus:outline-none focus:border-green-600 transition-colors"
                  placeholder="minombre"
                />
              </div>
              <p className="text-xs text-gray-600 mt-1">Solo letras, números y guiones bajos. Mín. 3 caracteres.</p>
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-1">Correo electrónico</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-green-600 transition-colors"
                placeholder="tu@correo.com"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-1">Contraseña</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-green-600 transition-colors"
                placeholder="mínimo 6 caracteres"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-1">Repetir contraseña</label>
              <input
                type="password"
                value={confirm}
                onChange={e => setConfirm(e.target.value)}
                required
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-green-600 transition-colors"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading || googleLoading}
              className="w-full bg-green-700 hover:bg-green-600 disabled:bg-gray-700 disabled:text-gray-500 text-white font-semibold py-2.5 rounded-lg transition-colors"
            >
              {loading ? 'Creando cuenta...' : 'Registrarme'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500">
            ¿Ya tenés cuenta?{' '}
            <Link to="/login" className="text-green-400 hover:text-green-300">
              Iniciá sesión
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18">
      <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"/>
      <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"/>
      <path fill="#FBBC05" d="M3.964 10.707A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.707V4.961H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.039l3.007-2.332z"/>
      <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.961L3.964 7.293C4.672 5.163 6.656 3.58 9 3.58z"/>
    </svg>
  )
}
