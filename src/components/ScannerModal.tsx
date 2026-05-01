import { useEffect, useRef, useState, useCallback } from 'react'
import { createWorker, Worker } from 'tesseract.js'
import { STICKER_MAP } from '../data/stickers'
import { GROUPS } from '../data/stickers'

interface ScannerModalProps {
  onAdd: (ids: string[]) => void
  onClose: () => void
}

const TEAM_CODES = GROUPS.flatMap(g => g.teams.map(t => t.code))
// Pattern: exactly 3 letters + 1-2 digits  e.g. ARG01, MEX5, BRA20
const CODE_RE = new RegExp(`\\b(${TEAM_CODES.join('|')}|FWC|CC)(\\d{1,2})\\b`, 'i')

function parseCode(text: string): string | null {
  const upper = text.toUpperCase().replace(/[^A-Z0-9\s]/g, ' ')
  const m = upper.match(CODE_RE)
  if (!m) return null
  const id = `${m[1].toUpperCase()}${m[2]}`
  return STICKER_MAP[id] ? id : null
}

function cropTopRight(video: HTMLVideoElement): HTMLCanvasElement {
  const sw = video.videoWidth
  const sh = video.videoHeight
  // Crop: right 30% and top 25%
  const cropX = Math.floor(sw * 0.68)
  const cropY = 0
  const cropW = sw - cropX
  const cropH = Math.floor(sh * 0.25)

  // Scale up 4x for better OCR
  const scale = 4
  const canvas = document.createElement('canvas')
  canvas.width = cropW * scale
  canvas.height = cropH * scale
  const ctx = canvas.getContext('2d')!
  ctx.imageSmoothingEnabled = false
  ctx.drawImage(video, cropX, cropY, cropW, cropH, 0, 0, canvas.width, canvas.height)

  // Grayscale + contrast
  const img = ctx.getImageData(0, 0, canvas.width, canvas.height)
  for (let i = 0; i < img.data.length; i += 4) {
    const g = 0.299 * img.data[i] + 0.587 * img.data[i + 1] + 0.114 * img.data[i + 2]
    const c = Math.min(255, Math.max(0, (g - 128) * 2 + 128))
    img.data[i] = img.data[i + 1] = img.data[i + 2] = c
  }
  ctx.putImageData(img, 0, 0)
  return canvas
}

export default function ScannerModal({ onAdd, onClose }: ScannerModalProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const workerRef = useRef<Worker | null>(null)
  const scanningRef = useRef(false)
  const lastDetected = useRef<string | null>(null)
  const lastDetectedAt = useRef(0)

  const [ready, setReady] = useState(false)
  const [camError, setCamError] = useState('')
  const [flash, setFlash] = useState<string | null>(null) // sticker ID just detected
  const [recentAdded, setRecentAdded] = useState<string[]>([])

  // Init camera + Tesseract worker
  useEffect(() => {
    async function init() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } },
        })
        streamRef.current = stream
        if (videoRef.current) {
          videoRef.current.srcObject = stream
          await videoRef.current.play()
        }
      } catch {
        setCamError('No se pudo acceder a la cámara.')
        return
      }

      const worker = await createWorker('eng', 1, {})
      await worker.setParameters({
        tessedit_char_whitelist: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789 ',
      })
      workerRef.current = worker
      setReady(true)
    }
    init()

    return () => {
      streamRef.current?.getTracks().forEach(t => t.stop())
      workerRef.current?.terminate()
    }
  }, [])

  const runScan = useCallback(async () => {
    if (scanningRef.current || !videoRef.current || !workerRef.current) return
    scanningRef.current = true

    try {
      const canvas = cropTopRight(videoRef.current)
      const { data: { text } } = await workerRef.current.recognize(canvas)
      const id = parseCode(text)

      if (id) {
        const now = Date.now()
        // Debounce: don't re-add same code within 3 seconds
        if (id !== lastDetected.current || now - lastDetectedAt.current > 3000) {
          lastDetected.current = id
          lastDetectedAt.current = now
          onAdd([id])
          setFlash(id)
          setRecentAdded(prev => [id, ...prev.slice(0, 9)])
          setTimeout(() => setFlash(null), 1500)
        }
      }
    } finally {
      scanningRef.current = false
    }
  }, [onAdd])

  // Auto-scan loop every 2s once ready
  useEffect(() => {
    if (!ready) return
    const interval = setInterval(runScan, 2000)
    return () => clearInterval(interval)
  }, [ready, runScan])

  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-black/70 backdrop-blur absolute top-0 left-0 right-0 z-10">
        <div>
          <h2 className="font-bold text-white">Escaneando...</h2>
          <p className="text-gray-400 text-xs">Apuntá el código (esquina sup. der.) al visor</p>
        </div>
        <button onClick={onClose} className="text-white bg-white/10 rounded-full w-9 h-9 flex items-center justify-center text-lg">✕</button>
      </div>

      {/* Camera */}
      <div className="flex-1 relative overflow-hidden bg-black">
        {camError ? (
          <div className="absolute inset-0 flex items-center justify-center px-6 text-center">
            <div>
              <span className="text-4xl">📷</span>
              <p className="text-red-400 mt-3">{camError}</p>
            </div>
          </div>
        ) : (
          <>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
            />

            {/* Target box — top-right of sticker = top-right of camera view */}
            <div className="absolute top-16 right-4 w-32 h-16 pointer-events-none">
              <div className="absolute inset-0 border-2 border-green-400 rounded-lg opacity-80" />
              {/* Corner accents */}
              <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-green-300 rounded-tl-lg" />
              <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-green-300 rounded-tr-lg" />
              <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-green-300 rounded-bl-lg" />
              <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-green-300 rounded-br-lg" />
              {/* Scanning line animation */}
              {ready && <div className="absolute left-1 right-1 h-0.5 bg-green-400/70 animate-scan-line" />}
              <p className="absolute -bottom-5 left-0 right-0 text-center text-green-400 text-[9px] font-bold">CÓDIGO</p>
            </div>

            {/* Flash overlay when code found */}
            {flash && (
              <div className="absolute inset-0 bg-green-500/20 flex items-center justify-center animate-fade-in pointer-events-none">
                <div className="bg-green-600 text-white font-black text-2xl px-6 py-3 rounded-2xl shadow-xl">
                  ✓ {flash}
                </div>
              </div>
            )}

            {/* Scanning indicator */}
            {ready && !flash && (
              <div className="absolute bottom-32 left-0 right-0 flex justify-center">
                <div className="flex items-center gap-2 bg-black/50 text-gray-300 text-xs px-3 py-1.5 rounded-full">
                  <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                  Escaneando automáticamente...
                </div>
              </div>
            )}

            {!ready && !camError && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="flex items-center gap-2 bg-black/60 text-gray-300 text-sm px-4 py-2 rounded-full">
                  <div className="w-4 h-4 border-2 border-green-400 border-t-transparent rounded-full animate-spin" />
                  Iniciando...
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Recent detections list */}
      <div className="bg-gray-900 border-t border-gray-800 px-4 py-3 max-h-40 overflow-y-auto">
        {recentAdded.length === 0 ? (
          <p className="text-gray-600 text-sm text-center py-2">
            Las figuritas detectadas aparecerán acá
          </p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {recentAdded.map((id, i) => (
              <span
                key={`${id}-${i}`}
                className="text-xs font-mono bg-green-900/50 text-green-300 border border-green-800 px-2 py-1 rounded-lg"
              >
                ✓ {id}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
