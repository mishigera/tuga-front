import { useState } from 'react'
import { MapPin, X, Check } from 'lucide-react'
import { useMapToggle } from '../hooks/useMapToggle'
import { reverseGeocode } from '../utils/reverseGeocode'
import type { SavedAddress } from '../types'

interface AddressPickerProps {
  onSave: (address: SavedAddress) => void
  trigger?: React.ReactNode
}

export function AddressPicker({ onSave, trigger }: AddressPickerProps) {
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const { isOpen, open, close, containerRef, getMarkerCoords, isOutOfRange, geolocating } =
    useMapToggle()

  async function handleConfirm() {
    if (!name.trim() || isOutOfRange) return
    const coords = getMarkerCoords()
    if (!coords) return

    setLoading(true)
    setError(null)
    try {
      const result = await reverseGeocode(coords.lat, coords.lng)
      onSave({ name: name.trim(), address: result.address, latitude: coords.lat, longitude: coords.lng })
      setName('')
      setError(null)
      close()
    } catch {
      setError('No pudimos obtener tu dirección, intenta de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  function handleOpen() {
    setName('')
    setError(null)
    open()
  }

  const canConfirm = name.trim().length > 0 && !isOutOfRange && !loading

  return (
    <>
      {/* Trigger */}
      <div onClick={handleOpen} style={{ cursor: 'pointer', display: 'inline-block' }}>
        {trigger ?? (
          <button
            style={{
              display: 'flex', alignItems: 'center', gap: 6, background: 'none',
              border: 'none', color: '#5A8A3A', fontSize: 13, fontWeight: 600,
              cursor: 'pointer', padding: 0,
            }}
          >
            <MapPin size={14} />
            + Agregar dirección
          </button>
        )}
      </div>

      {/* Bottom-sheet modal */}
      {isOpen && (
        <div
          style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)',
            zIndex: 2000, display: 'flex', alignItems: 'flex-end',
          }}
          onClick={(e) => { if (e.target === e.currentTarget) close() }}
        >
          <div
            style={{
              background: '#0E1014', borderRadius: '20px 20px 0 0', width: '100%',
              maxHeight: '92vh', display: 'flex', flexDirection: 'column',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Handle + Header */}
            <div style={{ padding: '12px 16px 0', flexShrink: 0 }}>
              <div style={{ width: 36, height: 4, background: '#2A2D35', borderRadius: 2, margin: '0 auto 14px' }} />
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                <span style={{ fontSize: 16, fontWeight: 700, color: '#fff' }}>Seleccionar ubicación</span>
                <button
                  onClick={close}
                  style={{
                    background: '#1E2128', border: 'none', borderRadius: '50%',
                    width: 32, height: 32, display: 'flex', alignItems: 'center',
                    justifyContent: 'center', cursor: 'pointer',
                  }}
                >
                  <X size={16} color="#9A9DA8" />
                </button>
              </div>
            </div>

            {/* Map — overflow hidden clips Mapbox elements to bounds */}
            <div style={{ position: 'relative', flexShrink: 0 }}>
              <div
                ref={containerRef}
                style={{
                  height: 260,
                  width: '100%',
                  overflow: 'hidden',
                  position: 'relative',
                }}
              />
              {/* Geolocating overlay inside the map area */}
              {geolocating && (
                <div style={{
                  position: 'absolute', inset: 0, zIndex: 10, pointerEvents: 'none',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: 'rgba(14,16,20,0.5)',
                }}>
                  <div style={{
                    background: 'rgba(14,16,20,0.9)', borderRadius: 10,
                    padding: '8px 14px', fontSize: 12, color: '#9A9DA8',
                    display: 'flex', alignItems: 'center', gap: 8,
                  }}>
                    <div className="spinner" style={{ width: 14, height: 14 }} />
                    Obteniendo tu ubicación...
                  </div>
                </div>
              )}
              {/* Hint */}
              <div style={{
                position: 'absolute', bottom: 8, left: '50%', transform: 'translateX(-50%)',
                background: 'rgba(14,16,20,0.85)', borderRadius: 8, padding: '4px 10px',
                fontSize: 11, color: '#9A9DA8', pointerEvents: 'none', zIndex: 5, whiteSpace: 'nowrap',
              }}>
                Arrastra el pin para ajustar
              </div>
            </div>

            {/* Out of range warning */}
            {isOutOfRange && (
              <div style={{
                margin: '8px 16px 0', background: 'rgba(231,76,60,0.1)',
                border: '1px solid rgba(231,76,60,0.3)', borderRadius: 10,
                padding: '8px 12px', fontSize: 12, color: '#E74C3C', flexShrink: 0,
              }}>
                Fuera del área de entrega (máximo 7 km)
              </div>
            )}

            {/* Name input + confirm */}
            <div style={{ padding: '14px 16px 32px', display: 'flex', flexDirection: 'column', gap: 12, flexShrink: 0 }}>
              <div>
                <label style={{
                  fontSize: 11, color: '#9A9DA8', textTransform: 'uppercase',
                  letterSpacing: 0.5, display: 'block', marginBottom: 6,
                }}>
                  Nombre de la dirección
                </label>
                <input
                  className="input"
                  placeholder="Ej. Casa, Trabajo, Gimnasio..."
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  autoComplete="off"
                  style={{ fontSize: 15 }}
                />
              </div>

              {error && (
                <p style={{
                  fontSize: 12, color: '#E74C3C', margin: 0,
                  background: 'rgba(231,76,60,0.08)', border: '1px solid rgba(231,76,60,0.2)',
                  borderRadius: 8, padding: '8px 12px',
                }}>
                  {error}
                </p>
              )}

              <button
                className="btn-primary"
                onClick={handleConfirm}
                disabled={!canConfirm}
              >
                <Check size={16} />
                {loading ? 'Obteniendo dirección...' : 'Confirmar ubicación'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
