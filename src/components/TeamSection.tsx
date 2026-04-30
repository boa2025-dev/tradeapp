import { Team, getStickersByTeam } from '../data/stickers'
import { OwnedMap } from '../lib/firestore'
import StickerItem from './StickerItem'

interface TeamSectionProps {
  team: Team
  owned: OwnedMap
  onIncrement: (id: string) => void
  onDecrement: (id: string) => void
}

export default function TeamSection({ team, owned, onIncrement, onDecrement }: TeamSectionProps) {
  const stickers = getStickersByTeam(team.code)
  const ownedCount = stickers.filter(s => (owned[s.id] ?? 0) > 0).length
  const duplicates = stickers.filter(s => (owned[s.id] ?? 0) > 1).length

  return (
    <div className="bg-gray-900/60 rounded-xl border border-gray-800 overflow-hidden">
      <div className="flex items-center justify-between px-3 py-2 bg-gray-900 border-b border-gray-800">
        <div className="flex items-center gap-2">
          <span className="text-lg">{team.flag}</span>
          <span className="font-semibold text-sm text-white">{team.name}</span>
        </div>
        <div className="flex items-center gap-2">
          {duplicates > 0 && (
            <span className="text-[10px] bg-amber-800/60 text-amber-300 px-1.5 py-0.5 rounded-full">
              {duplicates} rep.
            </span>
          )}
          <span className={`text-xs font-mono px-1.5 py-0.5 rounded ${
            ownedCount === stickers.length ? 'bg-green-800 text-green-200' : 'bg-gray-800 text-gray-400'
          }`}>
            {ownedCount}/{stickers.length}
          </span>
        </div>
      </div>
      <div className="grid grid-cols-5 gap-1 p-2">
        {stickers.map(s => (
          <StickerItem
            key={s.id}
            sticker={s}
            qty={owned[s.id] ?? 0}
            onIncrement={onIncrement}
            onDecrement={onDecrement}
          />
        ))}
      </div>
    </div>
  )
}
