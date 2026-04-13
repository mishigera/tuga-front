import { useState } from 'react'
import { MapPin, Plus, Star, Trash2 } from 'lucide-react'
import { useAddressStore } from '../store/addressStore'
import { AddressPicker } from '../components/addressPicker'
import { PageHeader } from '../components/PageHeader'
import type { SavedAddress } from '../types'

export function AddressManager() {
  const addresses = useAddressStore((s) => s.addresses)
  const addAddress = useAddressStore((s) => s.addAddress)
  const removeAddress = useAddressStore((s) => s.removeAddress)
  const setFavorite = useAddressStore((s) => s.setFavorite)

  const [confirmDeleteName, setConfirmDeleteName] = useState<string | null>(null)

  function handleSave(result: SavedAddress) {
    addAddress({ ...result, favorite: addresses.length === 0 })
  }

  function handleDelete(name: string) {
    if (confirmDeleteName !== name) {
      setConfirmDeleteName(name)
      return
    }
    removeAddress(name)
    setConfirmDeleteName(null)
  }

  return (
    <div className="page--no-nav">
      <PageHeader
        title="Mis Direcciones"
        right={
          <AddressPicker
            onSave={handleSave}
            trigger={
              <div
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
              </div>
            }
          />
        }
      />

      <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>

        {/* Empty state */}
        {addresses.length === 0 && (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '56px 24px',
            gap: 14,
            textAlign: 'center',
          }}>
            <div style={{
              width: 64, height: 64, borderRadius: '50%',
              background: 'rgba(90,138,58,0.12)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <MapPin size={28} color="#5A8A3A" />
            </div>
            <p style={{ fontSize: 16, fontWeight: 700, color: '#fff', margin: 0 }}>
              Sin direcciones guardadas
            </p>
            <p style={{ fontSize: 13, color: '#9A9DA8', margin: 0, lineHeight: 1.5 }}>
              Agrega una dirección para que tus pedidos lleguen exactamente donde los necesitas.
            </p>
            <AddressPicker
              onSave={handleSave}
              trigger={
                <button className="btn-primary" style={{ marginTop: 8 }}>
                  <Plus size={16} />
                  Agregar dirección
                </button>
              }
            />
          </div>
        )}

        {/* Address list */}
        {addresses.map((addr) => (
          <div
            key={addr.name}
            style={{
              background: '#181B21',
              borderRadius: 14,
              padding: 14,
              border: addr.favorite ? '1.5px solid #5A8A3A' : '1.5px solid transparent',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
              <div style={{
                width: 36, height: 36, borderRadius: 10,
                background: 'rgba(90,138,58,0.12)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              }}>
                <MapPin size={16} color="#5A8A3A" />
              </div>

              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
                  <span style={{ fontSize: 14, fontWeight: 700, color: '#fff' }}>{addr.name}</span>
                  {addr.favorite && (
                    <span style={{
                      fontSize: 10, fontWeight: 700, color: '#5A8A3A',
                      background: 'rgba(90,138,58,0.15)', borderRadius: 6,
                      padding: '2px 7px', letterSpacing: 0.3,
                    }}>
                      FAVORITA
                    </span>
                  )}
                </div>
                <p style={{
                  fontSize: 13, color: '#9A9DA8', margin: 0, lineHeight: 1.4,
                  overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                }}>
                  {addr.address}
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
              {!addr.favorite && (
                <button
                  onClick={() => setFavorite(addr.name)}
                  style={{
                    flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                    background: 'rgba(90,138,58,0.1)', border: '1px solid rgba(90,138,58,0.3)',
                    borderRadius: 10, padding: '8px 12px', cursor: 'pointer',
                    color: '#5A8A3A', fontSize: 12, fontWeight: 600,
                  }}
                >
                  <Star size={13} />
                  Marcar favorita
                </button>
              )}

              {confirmDeleteName === addr.name ? (
                <div style={{ flex: 1, display: 'flex', gap: 6 }}>
                  <button
                    onClick={() => handleDelete(addr.name)}
                    style={{
                      flex: 1, background: 'rgba(231,76,60,0.15)',
                      border: '1px solid rgba(231,76,60,0.4)', borderRadius: 10,
                      padding: '8px 10px', cursor: 'pointer', color: '#E74C3C',
                      fontSize: 12, fontWeight: 700,
                    }}
                  >
                    Confirmar
                  </button>
                  <button
                    onClick={() => setConfirmDeleteName(null)}
                    style={{
                      flex: 1, background: '#1E2128', border: '1px solid #2A2D35',
                      borderRadius: 10, padding: '8px 10px', cursor: 'pointer',
                      color: '#9A9DA8', fontSize: 12,
                    }}
                  >
                    Cancelar
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => handleDelete(addr.name)}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                    background: 'rgba(231,76,60,0.08)', border: '1px solid rgba(231,76,60,0.2)',
                    borderRadius: 10, padding: '8px 12px', cursor: 'pointer',
                    color: '#E74C3C', fontSize: 12, fontWeight: 600,
                  }}
                >
                  <Trash2 size={13} />
                  Eliminar
                </button>
              )}
            </div>
          </div>
        ))}

        {/* Add button when list has items */}
        {addresses.length > 0 && (
          <AddressPicker
            onSave={handleSave}
            trigger={
              <button
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                  background: 'transparent', border: '1.5px dashed #5A8A3A',
                  borderRadius: 14, padding: '14px 16px', cursor: 'pointer',
                  color: '#5A8A3A', fontSize: 14, fontWeight: 600, width: '100%',
                }}
              >
                <Plus size={16} />
                Agregar dirección
              </button>
            }
          />
        )}
      </div>
    </div>
  )
}
