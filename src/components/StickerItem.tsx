import { Sticker } from '../data/stickers'

interface StickerItemProps {
  sticker: Sticker
  qty: number
  onIncrement: (id: string) => void
  onDecrement: (id: string) => void
}

export default function StickerItem({ sticker, qty, onIncrement, onDecrement }: StickerItemProps) {
  const isBadge = sticker.type === 'badge'
  const hasNone = qty === 0
  const hasMultiple = qty > 1

  return (
    <div
      className={`
        relative flex flex-col items-center rounded-lg border overflow-hidden select-none
        transition-all duration-150
        ${isBadge ? 'col-span-2' : ''}
        ${hasNone
          ? 'bg-gray-900 border-gray-800'
          : hasMultiple
            ? 'bg-amber-900/30 border-amber-600/60'
            : 'bg-green-900/40 border-green-700'
        }
      `}
    >
      {/* Sticker ID + label */}
      <div className="w-full flex flex-col items-center pt-2 pb-1 px-1">
        <span className={`text-[11px] font-mono font-bold leading-none ${hasNone ? 'text-gray-500' : 'text-white'}`}>
          {sticker.id}
        </span>
        <span className={`text-[9px] leading-tight mt-0.5 ${hasNone ? 'text-gray-700' : 'text-gray-400'}`}>
          {isBadge ? '🛡' : sticker.type === 'teamphoto' ? '📷' : `#${sticker.number - 2}`}
        </span>
      </div>

      {/* Counter row: − qty + */}
      <div className={`w-full flex items-center border-t ${hasNone ? 'border-gray-800' : hasMultiple ? 'border-amber-800/50' : 'border-green-800/50'}`}>
        <button
          onClick={() => onDecrement(sticker.id)}
          disabled={qty === 0}
          className={`flex-1 py-1 text-sm font-bold transition-colors
            ${qty === 0
              ? 'text-gray-800 cursor-default'
              : 'text-gray-400 hover:text-red-400 hover:bg-red-900/20'
            }`}
        >
          −
        </button>

        <span className={`text-xs font-bold w-6 text-center tabular-nums
          ${hasNone ? 'text-gray-700' : hasMultiple ? 'text-amber-400' : 'text-green-400'}`}
        >
          {qty}
        </span>

        <button
          onClick={() => onIncrement(sticker.id)}
          className={`flex-1 py-1 text-sm font-bold transition-colors
            ${hasNone
              ? 'text-gray-600 hover:text-green-400 hover:bg-green-900/20'
              : 'text-gray-400 hover:text-green-400 hover:bg-green-900/20'
            }`}
        >
          +
        </button>
      </div>
    </div>
  )
}
