import { Sticker } from '../data/stickers'

interface StickerItemProps {
  sticker: Sticker
  qty: number
  onIncrement: (id: string) => void
  onDecrement: (id: string) => void
}

export default function StickerItem({ sticker, qty, onIncrement, onDecrement }: StickerItemProps) {
  const isBadge = sticker.type === 'badge'
  const hasMultiple = qty > 1

  return (
    <div
      className={`
        relative flex flex-col items-center justify-between rounded-lg border text-center select-none
        transition-all duration-150
        ${isBadge ? 'col-span-2' : ''}
        ${qty === 0
          ? 'bg-gray-900 border-gray-800'
          : hasMultiple
            ? 'bg-amber-900/30 border-amber-600/60 shadow-sm shadow-amber-900/30'
            : 'bg-green-900/40 border-green-700 shadow-sm shadow-green-900'
        }
      `}
    >
      {/* Top: sticker info — click to increment */}
      <button
        onClick={() => onIncrement(sticker.id)}
        title={`Agregar ${sticker.name}`}
        className="w-full flex flex-col items-center pt-2 pb-1 px-1"
      >
        {/* Quantity badge */}
        {qty > 0 && (
          <span className={`
            absolute top-0.5 right-0.5 text-[9px] font-bold leading-none px-1 py-0.5 rounded-full
            ${hasMultiple ? 'bg-amber-500 text-gray-900' : 'bg-green-600 text-white'}
          `}>
            {hasMultiple ? `x${qty}` : '✓'}
          </span>
        )}

        <span className={`text-[11px] font-mono font-bold leading-none ${qty > 0 ? 'text-white' : 'text-gray-500'}`}>
          {sticker.id}
        </span>
        <span className={`text-[9px] leading-tight mt-0.5 truncate w-full px-0.5 ${qty > 0 ? 'text-gray-400' : 'text-gray-700'}`}>
          {isBadge ? '🛡 Esc.' : sticker.type === 'teamphoto' ? '📷 Foto' : `#${sticker.number - 2}`}
        </span>
      </button>

      {/* Bottom: minus button */}
      <button
        onClick={() => onDecrement(sticker.id)}
        disabled={qty === 0}
        title="Quitar una"
        className={`
          w-full text-[10px] font-bold py-0.5 rounded-b-lg border-t transition-colors
          ${qty === 0
            ? 'text-gray-800 border-gray-800 cursor-default'
            : 'text-gray-400 border-gray-700 hover:bg-red-900/40 hover:text-red-300'
          }
        `}
      >
        −
      </button>
    </div>
  )
}
