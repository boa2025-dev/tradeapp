import { useState } from 'react'
import { Group, getStickersByGroup } from '../data/stickers'
import { OwnedMap } from '../lib/firestore'
import TeamSection from './TeamSection'

interface GroupSectionProps {
  group: Group
  owned: OwnedMap
  onIncrement: (id: string) => void
  onDecrement: (id: string) => void
}

export default function GroupSection({ group, owned, onIncrement, onDecrement }: GroupSectionProps) {
  const [open, setOpen] = useState(false)
  const stickers = getStickersByGroup(group.id)
  const ownedCount = stickers.filter(s => (owned[s.id] ?? 0) > 0).length
  const percentage = Math.round((ownedCount / stickers.length) * 100)

  return (
    <div className="rounded-2xl border border-gray-800 overflow-hidden">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-4 py-3 bg-gray-900 hover:bg-gray-800/80 transition-colors"
      >
        <div className="flex items-center gap-3">
          <span className="font-bold text-green-400 text-lg">Grupo {group.id}</span>
          <div className="flex gap-1">
            {group.teams.map(t => (
              <span key={t.code} title={t.name} className="text-base">{t.flag}</span>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2">
            <div className="w-24 h-1.5 bg-gray-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-green-500 rounded-full transition-all"
                style={{ width: `${percentage}%` }}
              />
            </div>
            <span className="text-xs text-gray-400">{ownedCount}/{stickers.length}</span>
          </div>
          <span className="text-gray-500 text-sm">{open ? '▲' : '▼'}</span>
        </div>
      </button>

      {open && (
        <div className="bg-gray-950 p-3 grid gap-3 sm:grid-cols-2">
          {group.teams.map(team => (
            <TeamSection
              key={team.code}
              team={team}
              owned={owned}
              onIncrement={onIncrement}
              onDecrement={onDecrement}
            />
          ))}
        </div>
      )}
    </div>
  )
}
