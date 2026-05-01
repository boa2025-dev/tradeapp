import { useEffect, useRef, useState } from 'react'
import jsQR from 'jsqr'

interface QRScannerModalProps {
  onDetected: (username: string) => void
  onClose: () => void
}

function parseUsernameFromQR(text: string): string | null {
  try {
    // Handles: https://tradeapp26.vercel.app/#/add?u=USERNAME
    const url = new URL(text)
    const u = url.hash.match(/[?&]u=([^&]+)/)
    if (u) return decodeURIComponent(u[1])
  } catch {
    // plain username fallback
    if (/^[a-z0-9_]{3,20}$/.test(text.trim())) return text.trim()
  }
  return null
}

export default function QRScannerModal({ onDetected, onClose }: QRScannerModalProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const [error, setCamError] = useState('')
  const [scanning, setScanning] = useState(false)

  useEffect(() => {
    async function start() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' },
        })
        streamRef.current = stream
        if (videoRef.current) {
          videoRef.current.srcObject = stream
          await videoRef.current.play()
        }
        setScanning(true)
      } catch {
        setCamError('No se pudo acceder a la cámara.')
      }
    }
    start()
    return () => streamRef.current?.getTracks().forEach(t => t.stop())
  }, [])

  useEffect(() => {
    if (!scanning) return
    const interval = setInterval(() => {
      const video = videoRef.current
      const canvas = canvasRef.current
      if (!video || !canvas || video.readyState < 2) return
      const ctx = canvas.getContext('2d')!
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
      ctx.drawImage(video, 0, 0)
      const img = ctx.getImageData(0, 0, canvas.width, canvas.height)
      const code = jsQR(img.data, img.width, img.height)
      if (code?.data) {
        const username = parseUsernameFromQR(code.data)
        if (username) {
          streamRef.current?.getTracks().forEach(t => t.stop())
          onDetected(username)
        }
      }
    }, 300)
    return () => clearInterval(interval)
  }, [scanning, onDetected])

  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col">
      <div className="flex items-center justify-between px-4 py-3 bg-black/70 backdrop-blur absolute top-0 left-0 right-0 z-10">
        <div>
          <h2 className="font-bold text-white">Escanear QR de amigo</h2>
          <p className="text-gray-400 text-xs">Apuntá la cámara al QR de tu amigo</p>
        </div>
        <button onClick={onClose} className="text-white bg-white/10 rounded-full w-9 h-9 flex items-center justify-center text-lg">✕</button>
      </div>

      <div className="flex-1 relative overflow-hidden bg-black">
        {error ? (
          <div className="absolute inset-0 flex items-center justify-center text-center px-6">
            <p className="text-red-400">{error}</p>
          </div>
        ) : (
          <>
            <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
            <canvas ref={canvasRef} className="hidden" />

            {/* Centered QR viewfinder */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="relative w-56 h-56">
                <div className="absolute inset-0 border-2 border-green-400 rounded-2xl opacity-80" />
                <div className="absolute top-0 left-0 w-6 h-6 border-t-[3px] border-l-[3px] border-green-300 rounded-tl-2xl" />
                <div className="absolute top-0 right-0 w-6 h-6 border-t-[3px] border-r-[3px] border-green-300 rounded-tr-2xl" />
                <div className="absolute bottom-0 left-0 w-6 h-6 border-b-[3px] border-l-[3px] border-green-300 rounded-bl-2xl" />
                <div className="absolute bottom-0 right-0 w-6 h-6 border-b-[3px] border-r-[3px] border-green-300 rounded-br-2xl" />
                {scanning && <div className="absolute left-2 right-2 h-0.5 bg-green-400/80 animate-scan-line" />}
              </div>
            </div>

            <div className="absolute bottom-10 left-0 right-0 flex justify-center">
              <div className="flex items-center gap-2 bg-black/50 text-gray-300 text-xs px-3 py-1.5 rounded-full">
                <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                Escaneando...
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
