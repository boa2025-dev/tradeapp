import { useState } from 'react'
import { useStickers } from '../hooks/useStickers'
import { GROUPS, STICKER_MAP, ALL_STICKERS } from '../data/stickers'
import { CC_STICKERS_IDS } from '../data/stickers'

type Tab = 'missing' | 'repeated'

const APP_URL = 'tradeapp26.vercel.app'

export default function MissingPage() {
  const { owned, missing, loading, total } = useStickers()
  const [tab, setTab] = useState<Tab>('missing')
  const [copied, setCopied] = useState(false)

  if (loading) {
    return (
      <div className="flex items-center justify-center h-40">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-green-500 border-t-transparent" />
      </div>
    )
  }

  // Repeated stickers: qty > 1
  const repeated = ALL_STICKERS.filter(s => (owned[s.id] ?? 0) > 1)

  // ── Copy missing list ─────────────────────────────────────────
  async function copyMissingList() {
    const lines = ['🏆 FIGURITAS FALTANTES - Mundial 2026', `Total: ${missing.length} de ${total}`, '']
    for (const group of GROUPS) {
      const teamsMissing = group.teams.flatMap(t => {
        const tm = missing.filter(s => s.teamCode === t.code)
        if (tm.length === 0) return []
        return [`${t.flag} ${t.name}: ${tm.map(s => s.id).join(', ')}`]
      })
      if (teamsMissing.length > 0) {
        lines.push(`Grupo ${group.id}:`, ...teamsMissing, '')
      }
    }
    const fwcMissing = missing.filter(s => s.type === 'intro' || s.type === 'museum')
    if (fwcMissing.length > 0) lines.push(`🏅 FWC: ${fwcMissing.map(s => s.id).join(', ')}`)
    const ccMissing = missing.filter(s => s.type === 'cocacola')
    if (ccMissing.length > 0) lines.push(`🥤 Coca-Cola: ${ccMissing.map(s => s.id).join(', ')}`)
    await navigator.clipboard.writeText(lines.join('\n'))
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // ── Build repeated message ────────────────────────────────────
  function buildRepeatedMessage(): string {
    const lines: string[] = [
      '¡Hola! Estoy usando TradeApp 📲⚽',
      `👉 ${APP_URL}`,
      '',
      'Mis figuritas *repetidas* del Mundial 2026:',
      '',
    ]

    for (const group of GROUPS) {
      const groupRepeated = repeated.filter(s => s.group === group.id)
      if (groupRepeated.length === 0) continue
      lines.push(`*Grupo ${group.id}*`)
      for (const team of group.teams) {
        const teamRep = groupRepeated.filter(s => s.teamCode === team.code)
        if (teamRep.length === 0) continue
        lines.push(`${team.flag} ${team.name}: ${teamRep.map(s => `${s.id}(x${owned[s.id]})`).join(', ')}`)
      }
      lines.push('')
    }

    const fwcRep = repeated.filter(s => s.type === 'intro' || s.type === 'museum')
    if (fwcRep.length > 0) lines.push(`🏅 FWC: ${fwcRep.map(s => `${s.id}(x${owned[s.id]})`).join(', ')}`)
    const ccRep = repeated.filter(s => s.type === 'cocacola')
    if (ccRep.length > 0) lines.push(`🥤 Coca-Cola: ${ccRep.map(s => `${s.id}(x${owned[s.id]})`).join(', ')}`)

    return lines.join('\n')
  }

  async function copyRepeated() {
    await navigator.clipboard.writeText(buildRepeatedMessage())
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  function shareWhatsApp() {
    const msg = buildRepeatedMessage()
    window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, '_blank')
  }

  // ── Render ────────────────────────────────────────────────────
  return (
    <div className="space-y-5">
      {/* Header + tabs */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-white">Mis figuritas</h1>
      </div>

      <div className="flex bg-gray-900 rounded-xl p-1 gap-1">
        <button
          onClick={() => setTab('missing')}
          className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-colors ${
            tab === 'missing' ? 'bg-gray-700 text-white' : 'text-gray-500 hover:text-gray-300'
          }`}
        >
          Faltantes
          <span className="ml-1.5 text-xs bg-gray-600 text-gray-300 px-1.5 py-0.5 rounded-full">
            {missing.length}
          </span>
        </button>
        <button
          onClick={() => setTab('repeated')}
          className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-colors ${
            tab === 'repeated' ? 'bg-amber-800/60 text-amber-300' : 'text-gray-500 hover:text-gray-300'
          }`}
        >
          Repetidas
          <span className="ml-1.5 text-xs bg-gray-700 text-gray-300 px-1.5 py-0.5 rounded-full">
            {repeated.length}
          </span>
        </button>
      </div>

      {/* ── FALTANTES tab ── */}
      {tab === 'missing' && (
        <>
          <div className="flex items-center justify-between">
            <p className="text-gray-500 text-sm">
              {missing.length === 0 ? '🎉 ¡Álbum completo!' : `${missing.length} de ${total}`}
            </p>
            {missing.length > 0 && (
              <button
                onClick={copyMissingList}
                className="bg-gray-800 hover:bg-gray-700 text-gray-200 text-sm px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5"
              >
                {copied ? '✓ Copiado' : '📋 Copiar'}
              </button>
            )}
          </div>

          {missing.length === 0 ? (
            <div className="bg-green-900/30 border border-green-800 rounded-2xl p-10 text-center">
              <span className="text-5xl">🏆</span>
              <p className="text-green-300 font-bold text-lg mt-4">¡Álbum completo!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* FWC missing */}
              {(() => {
                const fwcMissing = missing.filter(s => s.type === 'intro' || s.type === 'museum')
                if (fwcMissing.length === 0) return null
                return (
                  <div className="bg-gray-900 rounded-xl border border-gray-800 p-4">
                    <h3 className="font-semibold text-yellow-400 mb-3">
                      🏅 Introducción FWC
                      <span className="text-xs text-gray-500 ml-2 font-normal">faltan {fwcMissing.length}</span>
                    </h3>
                    <div className="flex flex-wrap gap-1.5">
                      {fwcMissing.map(s => (
                        <span key={s.id} className="text-xs font-mono bg-gray-800 text-yellow-300 px-2 py-0.5 rounded border border-gray-700">{s.id}</span>
                      ))}
                    </div>
                  </div>
                )
              })()}

              {/* CC missing */}
              {(() => {
                const ccMissing = missing.filter(s => s.type === 'cocacola')
                if (ccMissing.length === 0) return null
                return (
                  <div className="bg-gray-900 rounded-xl border border-red-900/50 p-4">
                    <h3 className="font-semibold text-red-400 mb-3 flex items-center gap-2">
                      🥤 Coca-Cola Exclusivas
                      <span className="text-xs text-gray-500 font-normal">faltan {ccMissing.length} de {CC_STICKERS_IDS.length}</span>
                    </h3>
                    <div className="flex flex-wrap gap-1.5">
                      {ccMissing.map(s => (
                        <span key={s.id} className="text-xs font-mono bg-gray-800 text-red-300 px-2 py-0.5 rounded border border-gray-700">{s.id}</span>
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
                      <span className="text-xs text-gray-500 ml-2 font-normal">faltan {groupMissing.length}</span>
                    </h3>
                    <div className="space-y-2">
                      {group.teams.map(team => {
                        const teamMissing = groupMissing.filter(s => s.teamCode === team.code)
                        if (teamMissing.length === 0) return null
                        return (
                          <div key={team.code} className="flex items-start gap-2">
                            <span className="text-base shrink-0 mt-0.5">{team.flag}</span>
                            <div className="flex flex-wrap gap-1">
                              {teamMissing.map(s => (
                                <span key={s.id} title={STICKER_MAP[s.id]?.name ?? s.id} className="text-xs font-mono bg-gray-800 text-gray-300 px-2 py-0.5 rounded border border-gray-700">{s.id}</span>
                              ))}
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
        </>
      )}

      {/* ── REPETIDAS tab ── */}
      {tab === 'repeated' && (
        <>
          <div className="flex items-center justify-between">
            <p className="text-gray-500 text-sm">
              {repeated.length === 0 ? 'No tenés repetidas todavía.' : `${repeated.length} figuritas repetidas`}
            </p>
            {repeated.length > 0 && (
              <button
                onClick={copyRepeated}
                className="bg-gray-800 hover:bg-gray-700 text-gray-200 text-sm px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5"
              >
                {copied ? '✓ Copiado' : '📋 Copiar'}
              </button>
            )}
          </div>

          {repeated.length === 0 ? (
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-10 text-center">
              <span className="text-5xl">🔄</span>
              <p className="text-gray-400 font-semibold mt-4">Sin repetidas aún</p>
              <p className="text-gray-600 text-sm mt-1">Cuando tengas más de 1 figurita igual aparece acá.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* WhatsApp share button */}
              <button
                onClick={shareWhatsApp}
                className="w-full flex items-center justify-center gap-3 bg-[#25D366] hover:bg-[#1ebe5d] text-white font-bold py-3.5 rounded-2xl transition-colors shadow-lg shadow-green-900/30"
              >
                <svg viewBox="0 0 24 24" className="w-6 h-6 fill-white">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                Compartir por WhatsApp
              </button>

              {/* Sticker list by group */}
              {GROUPS.map(group => {
                const groupRep = repeated.filter(s => s.group === group.id)
                if (groupRep.length === 0) return null
                return (
                  <div key={group.id} className="bg-gray-900 rounded-xl border border-amber-900/40 p-4">
                    <h3 className="font-semibold text-amber-400 mb-3">
                      Grupo {group.id}
                      <span className="text-xs text-gray-500 ml-2 font-normal">{groupRep.length} repetidas</span>
                    </h3>
                    <div className="space-y-2">
                      {group.teams.map(team => {
                        const teamRep = groupRep.filter(s => s.teamCode === team.code)
                        if (teamRep.length === 0) return null
                        return (
                          <div key={team.code} className="flex items-start gap-2">
                            <span className="text-base shrink-0 mt-0.5">{team.flag}</span>
                            <div className="flex flex-wrap gap-1">
                              {teamRep.map(s => (
                                <span key={s.id} className="text-xs font-mono bg-amber-900/40 text-amber-300 px-2 py-0.5 rounded border border-amber-800/50">
                                  {s.id} ×{owned[s.id]}
                                </span>
                              ))}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )
              })}

              {/* FWC repeated */}
              {(() => {
                const fwcRep = repeated.filter(s => s.type === 'intro' || s.type === 'museum')
                if (fwcRep.length === 0) return null
                return (
                  <div className="bg-gray-900 rounded-xl border border-amber-900/40 p-4">
                    <h3 className="font-semibold text-yellow-400 mb-3">🏅 FWC</h3>
                    <div className="flex flex-wrap gap-1.5">
                      {fwcRep.map(s => (
                        <span key={s.id} className="text-xs font-mono bg-amber-900/40 text-amber-300 px-2 py-0.5 rounded border border-amber-800/50">
                          {s.id} ×{owned[s.id]}
                        </span>
                      ))}
                    </div>
                  </div>
                )
              })()}

              {/* CC repeated */}
              {(() => {
                const ccRep = repeated.filter(s => s.type === 'cocacola')
                if (ccRep.length === 0) return null
                return (
                  <div className="bg-gray-900 rounded-xl border border-amber-900/40 p-4">
                    <h3 className="font-semibold text-red-400 mb-3">🥤 Coca-Cola</h3>
                    <div className="flex flex-wrap gap-1.5">
                      {ccRep.map(s => (
                        <span key={s.id} className="text-xs font-mono bg-amber-900/40 text-amber-300 px-2 py-0.5 rounded border border-amber-800/50">
                          {s.id} ×{owned[s.id]}
                        </span>
                      ))}
                    </div>
                  </div>
                )
              })()}
            </div>
          )}
        </>
      )}
    </div>
  )
}
