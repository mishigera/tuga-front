import { useState, useEffect } from 'react'
import { MapPin, Plus, Star, Trash2, Navigation } from 'lucide-react'
import { useAddressStore } from '../store/addressStore'
import { addressService } from '../api/addressService'
import { PageHeader } from '../components/PageHeader'
import type { Address } from '../types'

const ALIAS_CHIPS = ['Casa', 'Trabajo', 'Otro']

const GPS_ERRORS: Record<number, string> = {
  1: 'Permiso de ubicación denegado. Puedes ingresar tu dirección manualmente.',
  2: 'No se pudo obtener tu ubicación. Verifica que el GPS esté activado.',
  3: 'La solicitud de ubicación tardó demasiado. Intenta de nuevo.',
}

const emptyForm = {
  alias: '',
  street: '',
  neighborhood: '',
  city: '',
  notes: '',
}

export function AddressManager() {
  const addresses = useAddressStore((s) => s.addresses)
  const setAddresses = useAddressStore((s) => s.setAddresses)
  const addAddress = useAddressStore((s) => s.addAddress)
  const removeAddress = useAddressStore((s) => s.removeAddress)
  const setDefault = useAddressStore((s) => s.setDefault)

  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState(emptyForm)
  const [gpsError, setGpsError] = useState<string | null>(null)
  const [gpsLoading, setGpsLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null)

  // Tarea 6.1 — cargar direcciones al montar
  useEffect(() => {
    addressService.getAll().then((data) => {
      if (data.length > 0) setAddresses(data)
    })
  }, [setAddresses])

  // Tarea 6.2 — GPS
  function handleGps() {
    if (!navigator.geolocation) {
      setGpsError('Tu dispositivo no soporta geolocalización.')
      return
    }
    setGpsLoading(true)
    setGpsError(null)
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setGpsLoading(false)
        const { latitude, longitude } = pos.coords
        setForm((f) => ({
          ...f,
          notes: f.notes
            ? f.notes
            : `Lat: ${latitude.toFixed(6)}, Lng: ${longitude.toFixed(6)}`,
        }))
      },
      (err) => {
        setGpsLoading(false)
        setGpsError(GPS_ERRORS[err.code] ?? 'Error al obtener ubicación.')
      }
    )
  }

  // Tarea 6.3 — guardar
  async function handleSave() {
    if (!form.alias || !form.street || !form.city) return
    setSaving(true)
    try {
      const saved = await addressService.save({
        ...form,
        isDefault: addresses.length === 0,
      })
      addAddress(saved)
      setForm(emptyForm)
      setShowForm(false)
      setGpsError(null)
    } finally {
      setSaving(false)
    }
  }

  // Tarea 6.3 — eliminar con confirmación
  async function handleDelete(id: string) {
    if (confirmDeleteId !== id) {
      setConfirmDeleteId(id)
      return
    }
    await addressService.delete(id)
    removeAddress(id)
    setConfirmDeleteId(null)
  }

  return (
    <div className="page--no-nav">
      <PageHeader
        title="Mis Direcciones"
        right={
          <button
            onClick={() => { setShowForm(true); setGpsError(null) }}
            style={{
              background: '#5A8A3A',
              border: 'none',
              borderRadius: 10,
              width: 36,
              height: 36,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
            }}
          >
            <Plus size={18} color="#fff" />
          </button>
        }
      />

      <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>

        {/* Tarea 6.1 — estado vacío */}
        {addresses.length === 0 && !showForm && (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '48px 24px',
            gap: 14,
            textAlign: 'center',
          }}>
            <div style={{
              width: 64,
              height: 64,
              borderRadius: '50%',
              background: 'rgba(90,138,58,0.12)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <MapPin size={28} color="#5A8A3A" />
            </div>
            <p style={{ fontSize: 16, fontWeight: 700, color: '#fff', margin: 0 }}>
              Sin direcciones guardadas
            </p>
            <p style={{ fontSize: 13, color: '#9A9DA8', margin: 0, lineHeight: 1.5 }}>
              Agrega una dirección para que tus pedidos lleguen exactamente donde los necesitas.
            </p>
            <button
              className="btn-primary"
              onClick={() => setShowForm(true)}
              style={{ marginTop: 8 }}
            >
              <Plus size={16} />
              Agregar dirección
            </button>
          </div>
        )}

        {/* Tarea 6.1 — lista de direcciones */}
        {addresses.map((addr: Address) => (
          <AddressCard
            key={addr.id}
            address={addr}
            confirmingDelete={confirmDeleteId === addr.id}
            onSetDefault={() => setDefault(addr.id)}
            onDelete={() => handleDelete(addr.id)}
            onCancelDelete={() => setConfirmDeleteId(null)}
          />
        ))}

        {/* Botón agregar cuando ya hay direcciones */}
        {addresses.length > 0 && !showForm && (
          <button
            onClick={() => { setShowForm(true); setGpsError(null) }}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              background: 'transparent',
              border: '1.5px dashed #5A8A3A',
              borderRadius: 14,
              padding: '14px 16px',
              cursor: 'pointer',
              color: '#5A8A3A',
              fontSize: 14,
              fontWeight: 600,
            }}
          >
            <Plus size={16} />
            Agregar dirección
          </button>
        )}

        {/* Tarea 6.2 — formulario */}
        {showForm && (
          <AddressForm
            form={form}
            gpsError={gpsError}
            gpsLoading={gpsLoading}
            saving={saving}
            onChange={(field, value) => setForm((f) => ({ ...f, [field]: value }))}
            onGps={handleGps}
            onSave={handleSave}
            onCancel={() => { setShowForm(false); setForm(emptyForm); setGpsError(null) }}
          />
        )}
      </div>
    </div>
  )
}

// ─── Sub-componentes ────────────────────────────────────────────────────────

interface AddressCardProps {
  address: Address
  confirmingDelete: boolean
  onSetDefault: () => void
  onDelete: () => void
  onCancelDelete: () => void
}

function AddressCard({ address, confirmingDelete, onSetDefault, onDelete, onCancelDelete }: AddressCardProps) {
  return (
    <div style={{
      background: '#181B21',
      borderRadius: 14,
      padding: 14,
      border: address.isDefault ? '1.5px solid #5A8A3A' : '1.5px solid transparent',
    }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
        <div style={{
          width: 36,
          height: 36,
          borderRadius: 10,
          background: 'rgba(90,138,58,0.12)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}>
          <MapPin size={16} color="#5A8A3A" />
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
            <span style={{ fontSize: 14, fontWeight: 700, color: '#fff' }}>{address.alias}</span>
            {/* Tarea 6.4 — badge predeterminada */}
            {address.isDefault && (
              <span style={{
                fontSize: 10,
                fontWeight: 700,
                color: '#5A8A3A',
                background: 'rgba(90,138,58,0.15)',
                borderRadius: 6,
                padding: '2px 7px',
                letterSpacing: 0.3,
              }}>
                PREDETERMINADA
              </span>
            )}
          </div>
          <p style={{ fontSize: 13, color: '#9A9DA8', margin: 0, lineHeight: 1.4 }}>
            {address.street}
          </p>
          {address.neighborhood && (
            <p style={{ fontSize: 12, color: '#5A5D68', margin: '2px 0 0' }}>
              {address.neighborhood}, {address.city}
            </p>
          )}
          {address.notes && (
            <p style={{ fontSize: 12, color: '#5A5D68', margin: '2px 0 0', fontStyle: 'italic' }}>
              {address.notes}
            </p>
          )}
        </div>
      </div>

      <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
        {/* Tarea 6.4 — botón predeterminar */}
        {!address.isDefault && (
          <button
            onClick={onSetDefault}
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6,
              background: 'rgba(90,138,58,0.1)',
              border: '1px solid rgba(90,138,58,0.3)',
              borderRadius: 10,
              padding: '8px 12px',
              cursor: 'pointer',
              color: '#5A8A3A',
              fontSize: 12,
              fontWeight: 600,
            }}
          >
            <Star size={13} />
            Predeterminar
          </button>
        )}

        {/* Tarea 6.3 — eliminar con confirmación inline */}
        {confirmingDelete ? (
          <div style={{ flex: 1, display: 'flex', gap: 6 }}>
            <button
              onClick={onDelete}
              style={{
                flex: 1,
                background: 'rgba(231,76,60,0.15)',
                border: '1px solid rgba(231,76,60,0.4)',
                borderRadius: 10,
                padding: '8px 10px',
                cursor: 'pointer',
                color: '#E74C3C',
                fontSize: 12,
                fontWeight: 700,
              }}
            >
              Confirmar
            </button>
            <button
              onClick={onCancelDelete}
              style={{
                flex: 1,
                background: '#1E2128',
                border: '1px solid #2A2D35',
                borderRadius: 10,
                padding: '8px 10px',
                cursor: 'pointer',
                color: '#9A9DA8',
                fontSize: 12,
              }}
            >
              Cancelar
            </button>
          </div>
        ) : (
          <button
            onClick={onDelete}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6,
              background: 'rgba(231,76,60,0.08)',
              border: '1px solid rgba(231,76,60,0.2)',
              borderRadius: 10,
              padding: '8px 12px',
              cursor: 'pointer',
              color: '#E74C3C',
              fontSize: 12,
              fontWeight: 600,
            }}
          >
            <Trash2 size={13} />
            Eliminar
          </button>
        )}
      </div>
    </div>
  )
}

interface AddressFormProps {
  form: typeof emptyForm
  gpsError: string | null
  gpsLoading: boolean
  saving: boolean
  onChange: (field: keyof typeof emptyForm, value: string) => void
  onGps: () => void
  onSave: () => void
  onCancel: () => void
}

function AddressForm({ form, gpsError, gpsLoading, saving, onChange, onGps, onSave, onCancel }: AddressFormProps) {
  const inputStyle: React.CSSProperties = {
    width: '100%',
    background: '#1E2128',
    border: '1px solid #2A2D35',
    borderRadius: 10,
    padding: '11px 13px',
    fontSize: 14,
    color: '#fff',
    outline: 'none',
    boxSizing: 'border-box',
  }

  const labelStyle: React.CSSProperties = {
    fontSize: 11,
    color: '#9A9DA8',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 6,
    display: 'block',
  }

  return (
    <div style={{
      background: '#181B21',
      borderRadius: 16,
      padding: 16,
      display: 'flex',
      flexDirection: 'column',
      gap: 14,
      border: '1px solid #2A2D35',
    }}>
      <p style={{ fontSize: 15, fontWeight: 700, color: '#fff', margin: 0 }}>Nueva dirección</p>

      {/* Alias chips */}
      <div>
        <span style={labelStyle}>Alias</span>
        <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
          {ALIAS_CHIPS.map((chip) => (
            <button
              key={chip}
              onClick={() => onChange('alias', chip)}
              style={{
                padding: '6px 14px',
                borderRadius: 20,
                border: '1px solid',
                borderColor: form.alias === chip ? '#5A8A3A' : '#2A2D35',
                background: form.alias === chip ? 'rgba(90,138,58,0.15)' : 'transparent',
                color: form.alias === chip ? '#5A8A3A' : '#9A9DA8',
                fontSize: 13,
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              {chip}
            </button>
          ))}
        </div>
        <input
          style={inputStyle}
          placeholder="O escribe un alias personalizado"
          value={form.alias}
          onChange={(e) => onChange('alias', e.target.value)}
        />
      </div>

      {/* GPS */}
      <button
        onClick={onGps}
        disabled={gpsLoading}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
          background: 'rgba(90,138,58,0.1)',
          border: '1px solid rgba(90,138,58,0.35)',
          borderRadius: 10,
          padding: '11px 14px',
          cursor: gpsLoading ? 'not-allowed' : 'pointer',
          color: '#5A8A3A',
          fontSize: 13,
          fontWeight: 600,
          opacity: gpsLoading ? 0.7 : 1,
        }}
      >
        <Navigation size={15} />
        {gpsLoading ? 'Obteniendo ubicación...' : 'Usar mi ubicación actual'}
      </button>

      {gpsError && (
        <p style={{
          fontSize: 12,
          color: '#E74C3C',
          background: 'rgba(231,76,60,0.08)',
          border: '1px solid rgba(231,76,60,0.2)',
          borderRadius: 8,
          padding: '8px 12px',
          margin: 0,
          lineHeight: 1.4,
        }}>
          {gpsError}
        </p>
      )}

      {/* Campos manuales */}
      <div>
        <label style={labelStyle}>Calle y número</label>
        <input
          style={inputStyle}
          placeholder="Ej. Av. Insurgentes Sur 1234"
          value={form.street}
          onChange={(e) => onChange('street', e.target.value)}
        />
      </div>

      <div>
        <label style={labelStyle}>Colonia</label>
        <input
          style={inputStyle}
          placeholder="Ej. Del Valle"
          value={form.neighborhood}
          onChange={(e) => onChange('neighborhood', e.target.value)}
        />
      </div>

      <div>
        <label style={labelStyle}>Ciudad</label>
        <input
          style={inputStyle}
          placeholder="Ej. Ciudad de México"
          value={form.city}
          onChange={(e) => onChange('city', e.target.value)}
        />
      </div>

      <div>
        <label style={labelStyle}>Notas / Referencias</label>
        <textarea
          style={{ ...inputStyle, resize: 'none', height: 72 }}
          placeholder="Ej. Portón azul, entre calles..."
          value={form.notes}
          onChange={(e) => onChange('notes', e.target.value)}
        />
      </div>

      <div style={{ display: 'flex', gap: 10 }}>
        <button
          onClick={onCancel}
          style={{
            flex: 1,
            background: 'transparent',
            border: '1px solid #2A2D35',
            borderRadius: 12,
            padding: '12px',
            cursor: 'pointer',
            color: '#9A9DA8',
            fontSize: 14,
            fontWeight: 600,
          }}
        >
          Cancelar
        </button>
        <button
          onClick={onSave}
          disabled={saving || !form.alias || !form.street || !form.city}
          style={{
            flex: 2,
            background: saving || !form.alias || !form.street || !form.city ? '#2A2D35' : '#5A8A3A',
            border: 'none',
            borderRadius: 12,
            padding: '12px',
            cursor: saving || !form.alias || !form.street || !form.city ? 'not-allowed' : 'pointer',
            color: '#fff',
            fontSize: 14,
            fontWeight: 700,
          }}
        >
          {saving ? 'Guardando...' : 'Guardar dirección'}
        </button>
      </div>
    </div>
  )
}
