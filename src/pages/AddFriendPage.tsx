import { useEffect, useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { getUserByUsername, sendFriendRequest, getUserProfile } from '../lib/firestore'

export default function AddFriendPage() {
  const [searchParams] = useSearchParams()
  const { user, profile, loading } = useAuth()
  const navigate = useNavigate()
  const username = searchParams.get('u') ?? ''

  const [state, setState] = useState<'loading' | 'prompt' | 'sending' | 'done' | 'error'>('loading')
  const [msg, setMsg] = useState('')

  useEffect(() => {
    if (loading) return
    if (!user) {
      navigate(`/login?next=${encodeURIComponent(`/add?u=${username}`)}`, { replace: true })
      return
    }
    if (!username) { navigate('/friends', { replace: true }); return }
    if (profile?.username === username) { navigate('/friends', { replace: true }); return }
    setState('prompt')
  }, [loading, user, profile, username, navigate])

  async function handleAdd() {
    setState('sending')
    try {
      const targetUid = await getUserByUsername(username)
      if (!targetUid) { setMsg('Usuario no encontrado.'); setState('error'); return }
      const targetProfile = await getUserProfile(targetUid)
      if (profile?.friends.includes(targetUid)) {
        setMsg(`Ya sos amigo de @${username}.`); setState('done'); return
      }
      if (targetProfile?.friendRequests.includes(user!.uid)) {
        setMsg('Ya enviaste una solicitud antes.'); setState('done'); return
      }
      await sendFriendRequest(user!.uid, targetUid)
      setMsg(`¡Solicitud enviada a @${username}!`)
      setState('done')
    } catch {
      setMsg('Ocurrió un error. Intentá de nuevo.')
      setState('error')
    }
  }

  if (state === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-950">
        <div className="animate-spin rounded-full h-10 w-10 border-2 border-green-500 border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950 px-4">
      <div className="w-full max-w-sm bg-gray-900 rounded-2xl border border-gray-800 p-6 text-center space-y-5">
        {state === 'prompt' && (
          <>
            <span className="text-5xl">🤝</span>
            <div>
              <h2 className="text-xl font-bold text-white">Agregar amigo</h2>
              <p className="text-gray-400 text-sm mt-2">
                ¿Querés enviarle una solicitud de amistad a{' '}
                <span className="text-green-400 font-semibold">@{username}</span>?
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <button
                onClick={handleAdd}
                className="w-full bg-green-700 hover:bg-green-600 text-white font-bold py-3 rounded-xl transition-colors"
              >
                Sí, agregar a @{username}
              </button>
              <button
                onClick={() => navigate('/friends')}
                className="w-full bg-gray-800 hover:bg-gray-700 text-gray-300 font-semibold py-2.5 rounded-xl text-sm transition-colors"
              >
                Cancelar
              </button>
            </div>
          </>
        )}

        {state === 'sending' && (
          <>
            <div className="animate-spin rounded-full h-10 w-10 border-2 border-green-500 border-t-transparent mx-auto" />
            <p className="text-gray-400">Enviando solicitud...</p>
          </>
        )}

        {(state === 'done' || state === 'error') && (
          <>
            <span className="text-5xl">{state === 'done' ? '✅' : '❌'}</span>
            <p className={`font-semibold ${state === 'done' ? 'text-green-400' : 'text-red-400'}`}>{msg}</p>
            <button
              onClick={() => navigate('/friends')}
              className="w-full bg-gray-800 hover:bg-gray-700 text-white font-semibold py-3 rounded-xl transition-colors"
            >
              Ir a Amigos
            </button>
          </>
        )}
      </div>
    </div>
  )
}
