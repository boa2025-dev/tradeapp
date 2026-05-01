import { useEffect, useRef, useState } from 'react'
import { createWorker } from 'tesseract.js'
import { GROUPS, STICKER_MAP } from '../data/stickers'

interface ScannerModalProps {
  onAdd: (ids: string[]) => void
  onClose: () => void
}

type Phase = 'camera' | 'processing' | 'results'

// Build set of all valid sticker IDs for matching
const ALL_IDS = new Set(Object.keys(STICKER_MAP))
const TEAM_CODES = GROUPS.flatMap(g => g.teams.map(t => t.code))

function parseStickersFromText(text: string): string[] {
  const found = new Set<string>()
  const upper = text.toUpperCase().replace(/[^A-Z0-9\s]/g, ' ')

  // Match team codes + number: e.g. ARG1, ARG 1, ARG-1
  const teamPattern = new RegExp(
    `\\b(${TEAM_CODES.join('|')})[\\s\\-]?(\\d{1,2})\\b`,
    'g'
  )
  for (const m of upper.matchAll(teamPattern)) {
    const id = `${m[1]}${m[2]}`
    if (ALL_IDS.has(id)) found.add(id)
  }

  // Match FWC stickers
  for (const m of upper.matchAll(/\bFWC[\\s\\-]?(\d{1,2})\b/g)) {
    const id = `FWC${m[1].padStart(2, '0')}`
    if (ALL_IDS.has(id)) found.add(id)
  }

  // Match CC stickers
  for (const m of upper.matchAll(/\bCC[\\s\\-]?(\d{1,2})\b/g)) {
    const id = `CC${m[1]}`
    if (ALL_IDS.has(id)) found.add(id)
  }

  return [...found]
}

function preprocessCanvas(video: HTMLVideoElement): HTMLCanvasElement {
  const canvas = document.createElement('canvas')
  canvas.width = video.videoWidth
  canvas.height = video.videoHeight
  const ctx = canvas.getContext('2d')!
  ctx.drawImage(video, 0, 0)

  // Grayscale + contrast boost for better OCR
  const img = ctx.getImageData(0, 0, canvas.width, canvas.height)
  for (let i = 0; i < img.data.length; i += 4) {
    const gray = 0.299 * img.data[i] + 0.587 * img.data[i + 1] + 0.114 * img.data[i + 2]
    const contrast = Math.min(255, Math.max(0, (gray - 128) * 1.8 + 128))
    img.data[i] = img.data[i + 1] = img.data[i + 2] = contrast
  }
  ctx.putImageData(img, 0, 0)
  return canvas
}

export default function ScannerModal({ onAdd, onClose }: ScannerModalProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const [phase, setPhase] = useState<Phase>('camera')
  const [progress, setProgress] = useState(0)
  const [found, setFound] = useState<string[]>([])
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [camError, setCamError] = useState('')

  useEffect(() => {
    async function startCamera() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } },
        })
        streamRef.current = stream
        if (videoRef.current) videoRef.current.srcObject = stream
      } catch {
        setCamError('No se pudo acceder a la cámara. Verificá los permisos del navegador.')
      }
    }
    startCamera()
    return () => streamRef.current?.getTracks().forEach(t => t.stop())
  }, [])

  async function handleCapture() {
    if (!videoRef.current) return
    setPhase('processing')
    setProgress(0)

    const canvas = preprocessCanvas(videoRef.current)
    streamRef.current?.getTracks().forEach(t => t.stop())

    const worker = await createWorker('eng', 1, {
      logger: m => {
        if (m.status === 'recognizing text') setProgress(Math.round(m.progress * 100))
      },
    })
    await worker.setParameters({
      tessedit_char_whitelist: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789 ',
    })

    const { data: { text } } = await worker.recognize(canvas)
    await worker.terminate()

    const ids = parseStickersFromText(text)
    setFound(ids)
    setSelected(new Set(ids))
    setPhase('results')
  }

  function toggleSelect(id: string) {
    setSelected(prev => {
      const s = new Set(prev)
      s.has(id) ? s.delete(id) : s.add(id)
      return s
    })
  }

  function handleConfirm() {
    onAdd([...selected])
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-gray-900/80 backdrop-blur">
        <h2 className="font-bold text-white">
          {phase === 'camera' && 'Escanear figurita'}
          {phase === 'processing' && 'Procesando...'}
          {phase === 'results' && `${found.length} figurita${found.length !== 1 ? 's' : ''} detectada${found.length !== 1 ? 's' : ''}`}
        </h2>
        <button onClick={onClose} className="text-gray-400 hover:text-white text-2xl leading-none">✕</button>
      </div>

      {/* Camera phase */}
      {phase === 'camera' && (
        <div className="flex-1 flex flex-col">
          {camError ? (
            <div className="flex-1 flex items-center justify-center px-6 text-center">
              <div>
                <span className="text-4xl">📷</span>
                <p className="text-red-400 mt-3">{camError}</p>
              </div>
            </div>
          ) : (
            <>
              <div className="flex-1 relative overflow-hidden bg-black flex flex-col">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                />
                {/* Viewfinder overlay */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-72 h-40 border-2 border-green-400 rounded-xl opacity-70" />
                </div>
              </div>
              {/* Floating capture button */}
              <div className="absolute bottom-8 left-0 right-0 flex flex-col items-center gap-2 pointer-events-none">
                <p className="text-white/60 text-xs bg-black/40 px-3 py-1 rounded-full">
                  Apuntá al código de la figurita
                </p>
                <button
                  onClick={handleCapture}
                  className="pointer-events-auto w-20 h-20 rounded-full bg-white border-4 border-green-500 shadow-xl shadow-black/60 active:scale-95 transition-transform flex items-center justify-center"
                >
                  <span className="text-3xl">📸</span>
                </button>
              </div>
            </>
          )}
        </div>
      )}

      {/* Processing phase */}
      {phase === 'processing' && (
        <div className="flex-1 flex flex-col items-center justify-center gap-6 px-8">
          <div className="w-16 h-16 rounded-full border-4 border-green-600 border-t-transparent animate-spin" />
          <div className="w-full max-w-xs">
            <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-green-500 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-gray-400 text-sm text-center mt-2">Leyendo texto... {progress}%</p>
          </div>
        </div>
      )}

      {/* Results phase */}
      {phase === 'results' && (
        <div className="flex-1 flex flex-col overflow-hidden">
          {found.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center px-6 text-center gap-4">
              <span className="text-5xl">🔍</span>
              <p className="text-gray-300 font-semibold">No se detectó ningún código</p>
              <p className="text-gray-500 text-sm">Intentá con mejor iluminación o más cerca del código</p>
              <button
                onClick={() => { setPhase('camera'); setCamError('') }}
                className="bg-gray-800 hover:bg-gray-700 text-white font-semibold px-6 py-3 rounded-xl transition-colors"
              >
                Volver a intentar
              </button>
            </div>
          ) : (
            <>
              <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2">
                <p className="text-gray-500 text-sm mb-3">
                  Seleccioná las que querés agregar:
                </p>
                {found.map(id => {
                  const s = STICKER_MAP[id]
                  const checked = selected.has(id)
                  return (
                    <button
                      key={id}
                      onClick={() => toggleSelect(id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border transition-all ${
                        checked
                          ? 'bg-green-900/40 border-green-700'
                          : 'bg-gray-900 border-gray-800'
                      }`}
                    >
                      <div className={`w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 ${
                        checked ? 'bg-green-600 border-green-600' : 'border-gray-600'
                      }`}>
                        {checked && <span className="text-white text-xs font-bold">✓</span>}
                      </div>
                      <span className="font-mono font-bold text-white">{id}</span>
                      <span className="text-gray-400 text-sm truncate">{s?.name ?? ''}</span>
                    </button>
                  )
                })}
              </div>

              <div className="bg-gray-900 border-t border-gray-800 px-4 py-4 space-y-2">
                <button
                  onClick={handleConfirm}
                  disabled={selected.size === 0}
                  className="w-full bg-green-600 hover:bg-green-500 disabled:bg-gray-700 disabled:text-gray-500 text-white font-bold py-3.5 rounded-xl transition-colors"
                >
                  Agregar {selected.size > 0 ? `${selected.size} ` : ''}figurita{selected.size !== 1 ? 's' : ''}
                </button>
                <button
                  onClick={() => setPhase('camera')}
                  className="w-full bg-gray-800 hover:bg-gray-700 text-gray-300 font-semibold py-2.5 rounded-xl transition-colors text-sm"
                >
                  Escanear otra
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  )
}
