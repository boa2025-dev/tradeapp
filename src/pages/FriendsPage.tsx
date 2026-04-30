import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useFriends } from '../hooks/useFriends'
import { useStickers } from '../hooks/useStickers'

export default function FriendsPage() {
  const { friends, requests, loading, addByUsername, accept, reject, remove } = useFriends()
  const { owned } = useStickers()
  void owned

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

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold text-white">Amigos</h1>

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
