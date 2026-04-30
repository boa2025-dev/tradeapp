import { STICKER_MAP } from '../data/stickers'

interface TradeSectionProps {
  canGive: string[]
  canReceive: string[]
  friendUsername: string
}

export default function TradeSection({ canGive, canReceive, friendUsername }: TradeSectionProps) {
  return (
    <div className="grid sm:grid-cols-2 gap-4">
      <div className="bg-gray-900 rounded-xl border border-green-900 p-4">
        <h3 className="font-semibold text-green-400 mb-3 flex items-center gap-2">
          <span>➡️</span>
          <span>Podés darle a @{friendUsername}</span>
          <span className="ml-auto bg-green-800 text-green-200 text-xs px-2 py-0.5 rounded-full">
            {canGive.length}
          </span>
        </h3>
        {canGive.length === 0 ? (
          <p className="text-gray-600 text-sm">No tenés figuritas que le falten.</p>
        ) : (
          <div className="flex flex-wrap gap-1.5 max-h-60 overflow-y-auto">
            {canGive.map(id => {
              const s = STICKER_MAP[id]
              return (
                <span
                  key={id}
                  title={s?.name}
                  className="text-xs font-mono bg-gray-800 text-green-300 px-2 py-0.5 rounded border border-gray-700"
                >
                  {id}
                </span>
              )
            })}
          </div>
        )}
      </div>

      <div className="bg-gray-900 rounded-xl border border-blue-900 p-4">
        <h3 className="font-semibold text-blue-400 mb-3 flex items-center gap-2">
          <span>⬅️</span>
          <span>Podés pedirle a @{friendUsername}</span>
          <span className="ml-auto bg-blue-800 text-blue-200 text-xs px-2 py-0.5 rounded-full">
            {canReceive.length}
          </span>
        </h3>
        {canReceive.length === 0 ? (
          <p className="text-gray-600 text-sm">No tiene figuritas que te falten.</p>
        ) : (
          <div className="flex flex-wrap gap-1.5 max-h-60 overflow-y-auto">
            {canReceive.map(id => {
              const s = STICKER_MAP[id]
              return (
                <span
                  key={id}
                  title={s?.name}
                  className="text-xs font-mono bg-gray-800 text-blue-300 px-2 py-0.5 rounded border border-gray-700"
                >
                  {id}
                </span>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
