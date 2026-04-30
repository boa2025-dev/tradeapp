import { useEffect, useState, useCallback } from 'react'
import { useAuth } from './useAuth'
import { subscribeToStickers, setStickerQty, OwnedMap } from '../lib/firestore'
import { ALL_STICKERS, TOTAL_STICKERS } from '../data/stickers'

export function useStickers() {
  const { user } = useAuth()
  const [owned, setOwned] = useState<OwnedMap>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) { setOwned({}); setLoading(false); return }
    setLoading(true)
    const unsub = subscribeToStickers(user.uid, map => {
      setOwned(map)
      setLoading(false)
    })
    return unsub
  }, [user])

  const increment = useCallback(async (stickerId: string) => {
    if (!user) return
    const next = (owned[stickerId] ?? 0) + 1
    setOwned(prev => ({ ...prev, [stickerId]: next }))
    await setStickerQty(user.uid, stickerId, next)
  }, [user, owned])

  const decrement = useCallback(async (stickerId: string) => {
    if (!user) return
    const current = owned[stickerId] ?? 0
    if (current <= 0) return
    const next = current - 1
    setOwned(prev => {
      const copy = { ...prev }
      if (next === 0) delete copy[stickerId]
      else copy[stickerId] = next
      return copy
    })
    await setStickerQty(user.uid, stickerId, next)
  }, [user, owned])

  const ownedCount = Object.values(owned).filter(q => q > 0).length
  const missing = ALL_STICKERS.filter(s => !owned[s.id])
  const percentage = (ownedCount / TOTAL_STICKERS) * 100

  return { owned, missing, loading, increment, decrement, percentage, total: TOTAL_STICKERS, ownedCount }
}
