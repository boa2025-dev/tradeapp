import { useState } from 'react'
import { useStickers } from '../hooks/useStickers'
import { GROUPS, ALL_STICKERS } from '../data/stickers'
import ProgressBar from '../components/ProgressBar'
import GroupSection from '../components/GroupSection'
import StickerItem from '../components/StickerItem'

export default function AlbumPage() {
  const { owned, loading, increment, decrement, percentage, total, ownedCount } = useStickers()
  const [search, setSearch] = useState('')

  if (loading) {
    return (
      <div className="flex items-center justify-center h-40">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-green-500 border-t-transparent" />
      </div>
    )
  }

  const fwcStickers = ALL_STICKERS.filter(s => s.type === 'intro' || s.type === 'museum')
  const ccStickers  = ALL_STICKERS.filter(s => s.type === 'cocacola')

  const searchLower = search.toLowerCase()
  const filteredGroups = search
    ? GROUPS.map(g => ({
        ...g,
        teams: g.teams.filter(t =>
          t.name.toLowerCase().includes(searchLower) ||
          t.code.toLowerCase().includes(searchLower),
        ),
      })).filter(g => g.teams.length > 0)
    : GROUPS

  return (
    <div className="space-y-5">
      <ProgressBar owned={ownedCount} total={total} percentage={percentage} />

      <h1 className="text-xl font-bold text-white">Álbum FIFA World Cup 2026™</h1>

      <div className="flex items-center gap-3 text-xs text-gray-500">
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-600 inline-block"/>Tenés</span>
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-500 inline-block"/>Repetida</span>
      </div>

      <input
        type="text"
        placeholder="Buscar equipo..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-green-600 transition-colors"
      />

      {/* FWC intro */}
      {!search && (
        <div className="rounded-2xl border border-gray-800 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 bg-gray-900">
            <span className="font-bold text-yellow-400 text-lg">🏆 Introducción FWC</span>
            <span className="text-xs text-gray-400">
              {fwcStickers.filter(s => (owned[s.id] ?? 0) > 0).length}/{fwcStickers.length}
            </span>
          </div>
          <div className="bg-gray-950 p-3 grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 gap-1.5">
            {fwcStickers.map(s => (
              <StickerItem key={s.id} sticker={s} qty={owned[s.id] ?? 0} onIncrement={increment} onDecrement={decrement} />
            ))}
          </div>
        </div>
      )}

      {/* Groups */}
      <div className="space-y-3">
        {filteredGroups.map(group => (
          <GroupSection key={group.id} group={group} owned={owned} onIncrement={increment} onDecrement={decrement} />
        ))}
      </div>

      {filteredGroups.length === 0 && search && (
        <div className="text-center text-gray-600 py-12">No se encontró ningún equipo.</div>
      )}

      {/* Coca-Cola */}
      {!search && (
        <div className="rounded-2xl border border-red-900/60 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 bg-gray-900">
            <div className="flex items-center gap-2">
              <span className="text-lg">🥤</span>
              <span className="font-bold text-red-400 text-lg">Coca-Cola Exclusivas</span>
              <span className="text-xs text-gray-500 font-normal">CC1 – CC14</span>
            </div>
            <span className="text-xs text-gray-400">
              {ccStickers.filter(s => (owned[s.id] ?? 0) > 0).length}/{ccStickers.length}
            </span>
          </div>
          <div className="bg-gray-950 p-3 grid grid-cols-5 sm:grid-cols-7 md:grid-cols-10 gap-1.5">
            {ccStickers.map(s => (
              <StickerItem key={s.id} sticker={s} qty={owned[s.id] ?? 0} onIncrement={increment} onDecrement={decrement} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
