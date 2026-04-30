interface ProgressBarProps {
  owned: number
  total: number
  percentage: number
}

export default function ProgressBar({ owned, total, percentage }: ProgressBarProps) {
  return (
    <div className="bg-gray-900 rounded-2xl p-5 border border-gray-800">
      <div className="flex items-end justify-between mb-3">
        <div>
          <p className="text-3xl font-bold text-white">{percentage.toFixed(1)}%</p>
          <p className="text-gray-400 text-sm mt-0.5">del álbum completado</p>
        </div>
        <div className="text-right">
          <p className="text-xl font-semibold text-green-400">{owned}</p>
          <p className="text-gray-500 text-sm">de {total} figuritas</p>
        </div>
      </div>
      <div className="h-3 bg-gray-800 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-green-600 to-green-400 rounded-full transition-all duration-500"
          style={{ width: `${percentage}%` }}
        />
      </div>
      <div className="flex justify-between mt-1.5">
        <span className="text-xs text-gray-600">0</span>
        <span className="text-xs text-gray-600">{total - owned} faltantes</span>
      </div>
    </div>
  )
}
