import { useEffect, useState } from 'react'
import { useParams, Link, Navigate } from 'react-router-dom'
import { useFriends } from '../hooks/useFriends'
import { useStickers } from '../hooks/useStickers'
import { getUserProfile, UserProfile } from '../lib/firestore'
import TradeSection from '../components/TradeSection'

export default function TradesPage() {
  const { friendId } = useParams<{ friendId: string }>()
  const { friends, getTradesWithFriend } = useFriends()
  const { owned, loading: stickersLoading, ownedCount } = useStickers()
  void ownedCount

  const [friendProfile, setFriendProfile] = useState<UserProfile | null>(null)
  const [canGive, setCanGive] = useState<string[]>([])
  const [canReceive, setCanReceive] = useState<string[]>([])
  const [loading, setLoading] = useState(true)

  const isFriend = friends.some(f => f.uid === friendId)

  useEffect(() => {
    if (!friendId || stickersLoading) return

    async function load() {
      setLoading(true)
      try {
        const profile = await getUserProfile(friendId!)
        setFriendProfile(profile)
        if (profile) {
          const trades = await getTradesWithFriend(friendId!, owned)
          setCanGive(trades.canGive)
          setCanReceive(trades.canReceive)
        }
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [friendId, owned, stickersLoading]) // eslint-disable-line react-hooks/exhaustive-deps

  if (!isFriend && !loading) return <Navigate to="/friends" replace />

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <Link to="/friends" className="text-gray-500 hover:text-gray-300 transition-colors">
          ← Amigos
        </Link>
        <h1 className="text-xl font-bold text-white">
          Cambios con {friendProfile ? `@${friendProfile.username}` : '...'}
        </h1>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-40">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-green-500 border-t-transparent" />
        </div>
      ) : (
        <>
          <div className="bg-gray-900 rounded-2xl border border-gray-800 p-4 flex gap-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-400">{canGive.length}</p>
              <p className="text-xs text-gray-500 mt-0.5">podés dar</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-400">{canReceive.length}</p>
              <p className="text-xs text-gray-500 mt-0.5">podés recibir</p>
            </div>
            {canGive.length === 0 && canReceive.length === 0 && (
              <p className="text-gray-600 text-sm self-center">
                No hay intercambios posibles por ahora. Agreguen más figuritas.
              </p>
            )}
          </div>

          {friendProfile && (
            <TradeSection
              canGive={canGive}
              canReceive={canReceive}
              friendUsername={friendProfile.username}
            />
          )}
        </>
      )}
    </div>
  )
}
