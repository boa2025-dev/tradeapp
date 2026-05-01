import { QRCodeSVG } from 'qrcode.react'

interface QRModalProps {
  username: string
  onClose: () => void
}

const APP_URL = 'https://tradeapp26.vercel.app'

export default function QRModal({ username, onClose }: QRModalProps) {
  const url = `${APP_URL}/#/add?u=${username}`

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-gray-900 rounded-2xl border border-gray-700 p-6 w-full max-w-xs text-center space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-bold text-white text-lg">Tu QR de amigo</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-white text-xl">✕</button>
        </div>

        <p className="text-gray-400 text-sm">
          Mostrá este QR para que tus amigos te agreguen escaneándolo.
        </p>

        <div className="bg-white rounded-2xl p-4 flex items-center justify-center">
          <QRCodeSVG value={url} size={200} level="M" />
        </div>

        <div className="bg-gray-800 rounded-xl px-3 py-2">
          <p className="text-gray-500 text-xs">Tu usuario</p>
          <p className="text-green-400 font-bold text-lg">@{username}</p>
        </div>
      </div>
    </div>
  )
}
