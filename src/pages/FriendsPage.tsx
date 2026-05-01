import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useFriends } from '../hooks/useFriends'
import { useAuth } from '../hooks/useAuth'

const APP_URL = 'tradeapp26.vercel.app'

export default function FriendsPage() {
  const { friends, requests, loading, addByUsername, accept, reject, remove } = useFriends()
  const { profile } = useAuth()

  const [searchInput, setSearchInput] = useState('')
  const [searchMsg, setSearchMsg] = useState('')
  const [searchError, setSearchError] = useState('')
  const [searchLoading, setSearchLoading] = useState(false)

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    setSearchMsg('')
    setSearchError('')
    setSearchLoading(true)
    try {
      const msg = await addByUsername(searchInput)
      setSearchMsg(msg)
      setSearchInput('')
    } catch (err) {
      setSearchError(err instanceof Error ? err.message : 'Error')
    } finally {
      setSearchLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-40">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-green-500 border-t-transparent" />
      </div>
    )
  }

  function inviteViaWhatsApp() {
    if (!profile) return
    const msg = [
      '¡Hola! Te invito a usar TradeApp 📲⚽',
      '',
      'La app para completar el álbum de figuritas del Mundial 2026.',
      '',
      '✅ Marcá tus figuritas',
      '✅ Descubrí las que te faltan',
      '✅ Intercambiá con amigos',
      '',
      `Registrate acá 👇`,
      `${APP_URL}/#/register?ref=${profile.username}`,
    ].join('\n')
    window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, '_blank')
  }

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold text-white">Amigos</h1>

      {/* Invite via WhatsApp */}
      <button
        onClick={inviteViaWhatsApp}
        className="w-full flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#1ebe5d] text-white font-bold py-3 rounded-2xl transition-colors"
      >
        <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white shrink-0">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
        Invitar amigo por WhatsApp
      </button>

      {/* Add friend */}
      <div className="bg-gray-900 rounded-2xl border border-gray-800 p-5">
        <h2 className="font-semibold text-gray-200 mb-3">Agregar amigo</h2>
        <form onSubmit={handleAdd} className="flex gap-2">
          <div className="relative flex-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">@</span>
            <input
              type="text"
              value={searchInput}
              onChange={e => setSearchInput(e.target.value.toLowerCase())}
              placeholder="nombre_de_usuario"
              className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-7 pr-3 py-2 text-white text-sm focus:outline-none focus:border-green-600"
            />
          </div>
          <button
            type="submit"
            disabled={searchLoading || !searchInput.trim()}
            className="bg-green-700 hover:bg-green-600 disabled:bg-gray-700 disabled:text-gray-500 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
          >
            {searchLoading ? '...' : 'Enviar'}
          </button>
        </form>
        {searchMsg && (
          <p className="text-green-400 text-sm mt-2">{searchMsg}</p>
        )}
        {searchError && (
          <p className="text-red-400 text-sm mt-2">{searchError}</p>
        )}
      </div>

      {/* Pending requests */}
      {requests.length > 0 && (
        <div className="bg-gray-900 rounded-2xl border border-yellow-900 p-5">
          <h2 className="font-semibold text-yellow-400 mb-3">
            Solicitudes pendientes ({requests.length})
          </h2>
          <div className="space-y-2">
            {requests.map(req => (
              <div key={req.uid} className="flex items-center justify-between bg-gray-800 rounded-lg px-3 py-2">
                <span className="text-white font-medium">@{req.username}</span>
                <div className="flex gap-2">
                  <button
                    onClick={() => accept(req.uid)}
                    className="bg-green-700 hover:bg-green-600 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors"
                  >
                    Aceptar
                  </button>
                  <button
                    onClick={() => reject(req.uid)}
                    className="bg-gray-700 hover:bg-gray-600 text-gray-300 text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors"
                  >
                    Rechazar
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Friends list */}
      <div>
        <h2 className="font-semibold text-gray-200 mb-3">
          Mis amigos {friends.length > 0 && <span className="text-gray-500 font-normal">({friends.length})</span>}
        </h2>
        {friends.length === 0 ? (
          <div className="bg-gray-900 rounded-2xl border border-gray-800 p-8 text-center">
            <p className="text-gray-600">Todavía no tenés amigos agregados.</p>
            <p className="text-gray-700 text-sm mt-1">Buscalos por su nombre de usuario.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {friends.map(friend => (
              <div
                key={friend.uid}
                className="flex items-center justify-between bg-gray-900 rounded-xl border border-gray-800 px-4 py-3"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-green-800 flex items-center justify-center text-green-200 font-bold text-sm">
                    {friend.username[0].toUpperCase()}
                  </div>
                  <span className="text-white font-medium">@{friend.username}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Link
                    to={`/trades/${friend.uid}`}
                    className="bg-green-700 hover:bg-green-600 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors"
                  >
                    Ver cambios
                  </Link>
                  <button
                    onClick={() => remove(friend.uid)}
                    className="text-gray-600 hover:text-red-400 text-xs transition-colors px-2"
                    title="Eliminar amigo"
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
