import { useState } from 'react'
import { useStickers } from '../hooks/useStickers'
import { GROUPS, STICKER_MAP } from '../data/stickers'
import { CC_STICKERS_IDS } from '../data/stickers'

export default function MissingPage() {
  const { owned, missing, loading, total } = useStickers()
  const [copied, setCopied] = useState(false)

  if (loading) {
    return (
      <div className="flex items-center justify-center h-40">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-green-500 border-t-transparent" />
      </div>
    )
  }

  async function copyList() {
    const lines = ['🏆 FIGURITAS FALTANTES - Mundial 2026', `Total: ${missing.length} de ${total}`, '']
    for (const group of GROUPS) {
      const teamsMissing = group.teams.flatMap(t => {
        const teamMissing = missing.filter(s => s.teamCode === t.code)
        if (teamMissing.length === 0) return []
        return [`${t.flag} ${t.name}: ${teamMissing.map(s => s.id).join(', ')}`]
      })
      if (teamsMissing.length > 0) {
        lines.push(`Grupo ${group.id}:`)
        lines.push(...teamsMissing)
        lines.push('')
      }
    }
    const fwcMissing = missing.filter(s => s.type === 'intro' || s.type === 'museum')
    if (fwcMissing.length > 0) {
      lines.push(`🏅 FWC Intro: ${fwcMissing.map(s => s.id).join(', ')}`)
    }
    const ccMissing = missing.filter(s => s.type === 'cocacola')
    if (ccMissing.length > 0) {
      lines.push(`🥤 Coca-Cola: ${ccMissing.map(s => s.id).join(', ')}`)
    }
    await navigator.clipboard.writeText(lines.join('\n'))
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white">Figuritas faltantes</h1>
          <p className="text-gray-500 text-sm mt-0.5">
            {missing.length === 0
              ? '🎉 ¡Álbum completo!'
              : `${missing.length} de ${total} (tenés ${owned.size})`}
          </p>
        </div>
        {missing.length > 0 && (
          <button
            onClick={copyList}
            className="bg-gray-800 hover:bg-gray-700 text-gray-200 text-sm px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
          >
            {copied ? '✓ Copiado' : '📋 Copiar lista'}
          </button>
        )}
      </div>

      {missing.length === 0 ? (
        <div className="bg-green-900/30 border border-green-800 rounded-2xl p-10 text-center">
          <span className="text-5xl">🏆</span>
          <p className="text-green-300 font-bold text-lg mt-4">¡Álbum completo!</p>
          <p className="text-gray-500 text-sm mt-1">Tenés las {total} figuritas.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {/* FWC intro missing */}
          {(() => {
            const fwcMissing = missing.filter(s => s.type === 'intro' || s.type === 'museum')
            if (fwcMissing.length === 0) return null
            return (
              <div className="bg-gray-900 rounded-xl border border-gray-800 p-4">
                <h3 className="font-semibold text-yellow-400 mb-3">
                  🏅 Introducción FWC
                  <span className="text-xs text-gray-500 ml-2 font-normal">
                    faltan {fwcMissing.length}
                  </span>
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {fwcMissing.map(s => (
                    <span
                      key={s.id}
                      title={s.name}
                      className="text-xs font-mono bg-gray-800 text-yellow-300 px-2 py-0.5 rounded border border-gray-700"
                    >
                      {s.id}
                    </span>
                  ))}
                </div>
              </div>
            )
          })()}

          {/* Coca-Cola missing */}
          {(() => {
            const ccMissing = missing.filter(s => s.type === 'cocacola')
            if (ccMissing.length === 0) return null
            return (
              <div className="bg-gray-900 rounded-xl border border-red-900/50 p-4">
                <h3 className="font-semibold text-red-400 mb-3 flex items-center gap-2">
                  🥤 Coca-Cola Exclusivas
                  <span className="text-xs text-gray-500 font-normal">
                    faltan {ccMissing.length} de {CC_STICKERS_IDS.length}
                  </span>
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {ccMissing.map(s => (
                    <span
                      key={s.id}
                      title={s.name}
                      className="text-xs font-mono bg-gray-800 text-red-300 px-2 py-0.5 rounded border border-gray-700"
                    >
                      {s.id}
                    </span>
                  ))}
                </div>
              </div>
            )
          })()}

          {/* Groups missing */}
          {GROUPS.map(group => {
            const groupMissing = missing.filter(s => s.group === group.id)
            if (groupMissing.length === 0) return null
            return (
              <div key={group.id} className="bg-gray-900 rounded-xl border border-gray-800 p-4">
                <h3 className="font-semibold text-green-400 mb-3">
                  Grupo {group.id}
                  <span className="text-xs text-gray-500 ml-2 font-normal">
                    faltan {groupMissing.length}
                  </span>
                </h3>
                <div className="space-y-2">
                  {group.teams.map(team => {
                    const teamMissing = groupMissing.filter(s => s.teamCode === team.code)
                    if (teamMissing.length === 0) return null
                    return (
                      <div key={team.code} className="flex items-start gap-2">
                        <span className="text-base shrink-0 mt-0.5">{team.flag}</span>
                        <div className="flex flex-wrap gap-1">
                          {teamMissing.map(s => {
                            const sticker = STICKER_MAP[s.id]
                            return (
                              <span
                                key={s.id}
                                title={sticker?.name ?? s.id}
                                className="text-xs font-mono bg-gray-800 text-gray-300 px-2 py-0.5 rounded border border-gray-700"
                              >
                                {s.id}
                              </span>
                            )
                          })}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
