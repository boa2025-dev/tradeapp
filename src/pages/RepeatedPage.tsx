import { useStickers } from '../hooks/useStickers'
import { GROUPS, ALL_STICKERS } from '../data/stickers'

const APP_URL = 'https://tradeapp26.vercel.app'

const WA_ICON = (
  <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white shrink-0">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
)

export default function RepeatedPage() {
  const { owned, loading } = useStickers()

  if (loading) {
    return (
      <div className="flex items-center justify-center h-40">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-amber-500 border-t-transparent" />
      </div>
    )
  }

  const repeated = ALL_STICKERS.filter(s => (owned[s.id] ?? 0) > 1)

  function buildMessage(): string {
    const lines = [
      '¡Hola! Estoy usando TradeApp 📲⚽',
      `👉 ${APP_URL}`,
      '',
      'Mis figuritas *repetidas* del Mundial 2026:',
      '',
    ]
    for (const group of GROUPS) {
      const gr = repeated.filter(s => s.group === group.id)
      if (gr.length === 0) continue
      lines.push(`*Grupo ${group.id}*`)
      for (const team of group.teams) {
        const tr = gr.filter(s => s.teamCode === team.code)
        if (tr.length === 0) continue
        lines.push(`${team.flag} ${team.name}: ${tr.map(s => s.id).join(', ')}`)
      }
      lines.push('')
    }
    const fwcR = repeated.filter(s => s.type === 'intro' || s.type === 'museum')
    if (fwcR.length > 0) lines.push(`🏅 FWC: ${fwcR.map(s => s.id).join(', ')}`)
    const ccR = repeated.filter(s => s.type === 'cocacola')
    if (ccR.length > 0) lines.push(`🥤 Coca-Cola: ${ccR.map(s => s.id).join(', ')}`)
    return lines.join('\n')
  }

  async function copy() {
    await navigator.clipboard.writeText(buildMessage())
  }

  function shareWA() {
    window.open(`https://wa.me/?text=${encodeURIComponent(buildMessage())}`, '_blank')
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white">Repetidas</h1>
          <p className="text-gray-500 text-sm mt-0.5">
            {repeated.length === 0 ? 'Sin repetidas por ahora' : `${repeated.length} figuritas repetidas`}
          </p>
        </div>
        {repeated.length > 0 && (
          <button
            onClick={copy}
            className="bg-gray-800 hover:bg-gray-700 text-gray-200 text-sm px-3 py-1.5 rounded-lg transition-colors"
          >
            📋 Copiar
          </button>
        )}
      </div>

      {repeated.length === 0 ? (
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-12 text-center">
          <span className="text-5xl">🔄</span>
          <p className="text-gray-400 font-semibold mt-4">Sin repetidas todavía</p>
          <p className="text-gray-600 text-sm mt-1">Cuando tengas más de 1 figurita igual aparece acá.</p>
        </div>
      ) : (
        <div className="space-y-4">
          <button
            onClick={shareWA}
            className="w-full flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#1ebe5d] text-white font-bold py-3 rounded-2xl transition-colors"
          >
            {WA_ICON} Compartir por WhatsApp
          </button>

          {GROUPS.map(group => {
            const gr = repeated.filter(s => s.group === group.id)
            if (gr.length === 0) return null
            return (
              <div key={group.id} className="bg-gray-900 rounded-xl border border-amber-900/40 p-4">
                <h3 className="font-semibold text-amber-400 mb-3">
                  Grupo {group.id}
                  <span className="text-xs text-gray-500 ml-2 font-normal">{gr.length} repetidas</span>
                </h3>
                <div className="space-y-2">
                  {group.teams.map(team => {
                    const tr = gr.filter(s => s.teamCode === team.code)
                    if (tr.length === 0) return null
                    return (
                      <div key={team.code} className="flex items-start gap-2">
                        <span className="text-base shrink-0 mt-0.5">{team.flag}</span>
                        <div className="flex flex-wrap gap-1">
                          {tr.map(s => (
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

          {(() => {
            const fwcR = repeated.filter(s => s.type === 'intro' || s.type === 'museum')
            if (fwcR.length === 0) return null
            return (
              <div className="bg-gray-900 rounded-xl border border-amber-900/40 p-4">
                <h3 className="font-semibold text-yellow-400 mb-3">🏅 FWC</h3>
                <div className="flex flex-wrap gap-1.5">
                  {fwcR.map(s => <span key={s.id} className="text-xs font-mono bg-amber-900/40 text-amber-300 px-2 py-0.5 rounded border border-amber-800/50">{s.id} ×{owned[s.id]}</span>)}
                </div>
              </div>
            )
          })()}

          {(() => {
            const ccR = repeated.filter(s => s.type === 'cocacola')
            if (ccR.length === 0) return null
            return (
              <div className="bg-gray-900 rounded-xl border border-amber-900/40 p-4">
                <h3 className="font-semibold text-red-400 mb-3">🥤 Coca-Cola</h3>
                <div className="flex flex-wrap gap-1.5">
                  {ccR.map(s => <span key={s.id} className="text-xs font-mono bg-amber-900/40 text-amber-300 px-2 py-0.5 rounded border border-amber-800/50">{s.id} ×{owned[s.id]}</span>)}
                </div>
              </div>
            )
          })()}
        </div>
      )}
    </div>
  )
}
