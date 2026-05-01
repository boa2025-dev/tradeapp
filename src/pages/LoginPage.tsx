import { useState, FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { sendPasswordResetEmail } from 'firebase/auth'
import { auth } from '../lib/firebase'
import { useAuth } from '../hooks/useAuth'

export default function LoginPage() {
  const { login, loginWithGoogle } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)

  const [showReset, setShowReset] = useState(false)
  const [resetEmail, setResetEmail] = useState('')
  const [resetMsg, setResetMsg] = useState('')
  const [resetError, setResetError] = useState('')
  const [resetLoading, setResetLoading] = useState(false)

  async function handleReset(e: FormEvent) {
    e.preventDefault()
    setResetMsg('')
    setResetError('')
    setResetLoading(true)
    try {
      await sendPasswordResetEmail(auth, resetEmail)
      setResetMsg('Te enviamos un correo para restablecer tu contraseña. Revisá tu bandeja de entrada.')
    } catch (err) {
      const msg = err instanceof Error ? err.message : ''
      if (msg.includes('user-not-found') || msg.includes('invalid-email')) {
        setResetError('No encontramos una cuenta con ese correo.')
      } else {
        setResetError('Ocurrió un error. Intentá de nuevo.')
      }
    } finally {
      setResetLoading(false)
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(email, password)
      navigate('/album')
    } catch (err) {
      const msg = err instanceof Error ? err.message : ''
      if (msg.includes('invalid-credential') || msg.includes('wrong-password') || msg.includes('user-not-found')) {
        setError('Correo o contraseña incorrectos.')
      } else {
        setError(msg || 'Error al iniciar sesión.')
      }
    } finally {
      setLoading(false)
    }
  }

  async function handleGoogle() {
    setError('')
    setGoogleLoading(true)
    try {
      const { needsUsername } = await loginWithGoogle()
      navigate(needsUsername ? '/register?google=1' : '/album')
    } catch (err) {
      const msg = err instanceof Error ? err.message : ''
      if (msg.includes('popup-closed-by-user') || msg.includes('cancelled-popup-request')) {
        // user closed popup, do nothing
      } else {
        setError(msg || 'Error al iniciar sesión con Google.')
      }
    } finally {
      setGoogleLoading(false)
    }
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
          <h2 className="text-lg font-semibold text-white">Iniciar sesión</h2>

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
              <div className="flex items-center justify-between mb-1">
                <label className="text-sm text-gray-400">Contraseña</label>
                <button
                  type="button"
                  onClick={() => { setShowReset(v => !v); setResetMsg(''); setResetError('') }}
                  className="text-xs text-green-500 hover:text-green-400 transition-colors"
                >
                  ¿Olvidaste tu contraseña?
                </button>
              </div>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-green-600 transition-colors"
                placeholder="••••••••"
              />
            </div>

            {/* Reset password panel */}
            {showReset && (
              <div className="bg-gray-800/60 border border-gray-700 rounded-xl p-4 space-y-3">
                {resetMsg ? (
                  <div className="flex flex-col items-center text-center gap-3 py-2">
                    <span className="text-4xl">📬</span>
                    <div>
                      <p className="text-white font-semibold text-sm">¡Revisá tu correo!</p>
                      <p className="text-gray-400 text-xs mt-1">
                        Te enviamos un link para restablecer tu contraseña a{' '}
                        <span className="text-green-400">{resetEmail}</span>.
                      </p>
                    </div>
                    <div className="flex items-center gap-2 bg-yellow-900/30 border border-yellow-800/50 text-yellow-300 text-xs px-3 py-2 rounded-lg w-full justify-center">
                      <span>⚠️</span>
                      <span>Si no lo ves, revisá la carpeta de <strong>spam</strong></span>
                    </div>
                    <button
                      type="button"
                      onClick={() => { setShowReset(false); setResetMsg(''); setResetEmail('') }}
                      className="text-xs text-gray-500 hover:text-gray-300 transition-colors"
                    >
                      Volver al inicio de sesión
                    </button>
                  </div>
                ) : (
                  <>
                    <p className="text-gray-300 text-sm font-medium">Restablecer contraseña</p>
                    <form onSubmit={handleReset} className="flex gap-2">
                      <input
                        type="email"
                        value={resetEmail}
                        onChange={e => setResetEmail(e.target.value)}
                        required
                        placeholder="tu@correo.com"
                        className="flex-1 bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-green-600 transition-colors"
                      />
                      <button
                        type="submit"
                        disabled={resetLoading}
                        className="bg-green-700 hover:bg-green-600 disabled:bg-gray-600 text-white text-sm font-semibold px-3 py-2 rounded-lg transition-colors whitespace-nowrap"
                      >
                        {resetLoading ? '...' : 'Enviar'}
                      </button>
                    </form>
                    {resetError && <p className="text-red-400 text-xs">{resetError}</p>}
                  </>
                )}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || googleLoading}
              className="w-full bg-green-700 hover:bg-green-600 disabled:bg-gray-700 disabled:text-gray-500 text-white font-semibold py-2.5 rounded-lg transition-colors"
            >
              {loading ? 'Ingresando...' : 'Ingresar'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500">
            ¿No tenés cuenta?{' '}
            <Link to="/register" className="text-green-400 hover:text-green-300">
              Registrate
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
