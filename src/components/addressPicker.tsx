import { useState } from 'react'
import { useMapToggle } from '../hooks/useMapToggle'
import { reverseGeocode, ReverseGeocodeResult } from '../utils/reverseGeocode'



type AddressPickerProps = {
  onSave: (address: ReverseGeocodeResult) => void
}

export function AddressPicker({ onSave }: AddressPickerProps) {
  const { isOpen, open, close, containerRef, getMarkerCoords } = useMapToggle()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleConfirm = async () => {
    const coords = getMarkerCoords()
    if (!coords) return

    setLoading(true)
    setError(null)

    try {
      const result = await reverseGeocode(coords.lat, coords.lng)
      onSave(result)  // { lat, lng, address }
      close()
    } catch {
      setError('No pudimos obtener tu dirección, intenta de nuevo')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      {!isOpen && (
        <button onClick={open}>+ Agregar dirección</button>
      )}

      {isOpen && (
        <div>
          <div ref={containerRef} style={{ height: '350px' }} />
          {error && <p style={{ color: 'red' }}>{error}</p>}
          <button onClick={close}>Cancelar</button>
          <button onClick={handleConfirm} disabled={loading}>
            {loading ? 'Obteniendo dirección...' : 'Confirmar'}
          </button>
        </div>
      )}
    </div>
  )
}