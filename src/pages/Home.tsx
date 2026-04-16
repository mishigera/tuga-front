import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Search, ShoppingCart, X, Plus } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { shopsApi } from '../api/shops'
import { RestaurantCard } from '../components/RestaurantCard'
import { SkeletonCard } from '../components/SkeletonCard'
import { useStaggerAnimation } from '../hooks/useStaggerAnimation'
import { useAuthStore } from '../store/authStore'
import { useCartStore } from '../store/cartStore'
import { useAddressStore } from '../store/addressStore'
import { AddressPicker } from '../components/addressPicker'
import { MapPin } from 'lucide-react'
import type { SavedAddress } from '../types'

// const CATEGORIES = ['Todos', 'Comida', 'Bebidas', 'Postres']

export function Home() {
  const navigate = useNavigate()
  const user = useAuthStore((s) => s.user)
  const totalItems = useCartStore((s) => s.totalItems())
  const getFavorite = useAddressStore((s) => s.getFavorite)
  const addAddress = useAddressStore((s) => s.addAddress)
  const setFavorite = useAddressStore((s) => s.setFavorite)
  const addresses = useAddressStore((s) => s.addresses)
  const favoriteAddress = getFavorite()
  const [search, setSearch] = useState('')
  // const [category, setCategory] = useState('Todos')
  const [showAddressSheet, setShowAddressSheet] = useState(false)

  const { data: shops, isLoading, isError } = useQuery({
    queryKey: ['shops'],
    queryFn: shopsApi.getAll,
  })

  const restaurants = shops ?? []
  const stagger = useStaggerAnimation({
    itemCount: restaurants.length,
    delayMs: 60,
    durationMs: 300,
    enabled: !isLoading,
    key: 'home-shops',
  })

  const filtered = shops?.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.description.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="page">
      {/* Header */}
      <div style={{ padding: '16px 16px 0' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
          <span style={{ fontSize: 12, color: '#9A9DA8', textTransform: 'uppercase', letterSpacing: 1 }}>
            Tuga App
          </span>
          <button
            onClick={() => navigate('/carrito')}
            style={{
              background: '#1E2128',
              border: 'none',
              borderRadius: 10,
              width: 36,
              height: 36,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              position: 'relative',
            }}
          >
            <ShoppingCart size={18} color="#fff" />
            {totalItems > 0 && (
              <span style={{
                position: 'absolute',
                top: -4,
                right: -4,
                background: '#5A8A3A',
                color: '#fff',
                borderRadius: '50%',
                width: 16,
                height: 16,
                fontSize: 9,
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                {totalItems}
              </span>
            )}
          </button>
        </div>
        <h1 style={{ fontSize: 26, fontWeight: 800, marginBottom: 6, letterSpacing: -0.5 }}>
          Hola, {user?.name.split(' ')[0] ?? 'Usuario'} 👋 {/* split en el primer espacio para solo mostrar el primer nombre */}
        </h1>

        {/* Address widget */}
        {addresses.length > 0 ? (
          <div
            onClick={() => setShowAddressSheet(true)}
            style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 18, cursor: 'pointer' }}
          >
            <MapPin size={13} color="#5A8A3A" />
            <span style={{ fontSize: 13, color: '#9A9DA8', maxWidth: 260, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              <span style={{ color: '#fff', fontWeight: 600 }}>{favoriteAddress?.name ?? addresses[0].name}</span>
              {' · '}
              {favoriteAddress?.address ?? addresses[0].address}
            </span>
          </div>
        ) : (
          <AddressPicker
            onSave={(result: SavedAddress) => {
              addAddress({ ...result, favorite: true })
            }}
            trigger={
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 18, cursor: 'pointer' }}>
                <MapPin size={13} color="#5A5D68" />
                <span style={{ fontSize: 13, color: '#5A8A3A', fontWeight: 600 }}>+ Agregar dirección</span>
              </div>
            }
          />
        )}

        {/* Search */}
        <div style={{ position: 'relative', marginBottom: 16 }}>
          <Search size={16} color="#5A5D68" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }} />
          <input
            className="input"
            style={{ paddingLeft: 40 }}
            placeholder="Buscar restaurante..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        {/* esto aun no es dinamico cuando lo sea agregar TODO */}
        {/* Category Pills */}
        {/* <div style={{ display: 'flex', gap: 8, marginBottom: 20, overflowX: 'auto', paddingBottom: 4 }}>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className="category-pill"
              style={{
                padding: '8px 16px',
                borderRadius: 20,
                border: 'none',
                background: category === cat ? '#5A8A3A' : '#1A1D24',
                color: category === cat ? '#fff' : '#9A9DA8',
                fontSize: 13,
                fontWeight: 600,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                flexShrink: 0,
              }}
            >
              {cat}
            </button>
          ))}
        </div> */}
      </div>

      {/* Restaurant List */}
      <div style={{ padding: '0 16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: '#9A9DA8', textTransform: 'uppercase', letterSpacing: 0.5 }}>
            Restaurantes
          </span>
          {/* <button style={{ background: 'none', border: 'none', color: '#5A8A3A', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
            Ver todos
          </button> */}
        </div>

        {isLoading && (
          <>
            <SkeletonCard variant="restaurant" />
            <SkeletonCard variant="restaurant" />
            <SkeletonCard variant="restaurant" />
          </>
        )}

        {isError && (
          <div className="error-state">
            <p>No se pudo cargar los restaurantes.</p>
            <p style={{ fontSize: 12 }}>Verifica que el backend esté corriendo en el puerto 3000.</p>
          </div>
        )}

        {filtered?.map((shop, i) => (
          <div key={shop._id ?? shop.id ?? i} className={stagger.className} style={stagger.getItemStyle(i)}>
            <RestaurantCard shop={shop} />
          </div>
        ))}

        {filtered?.length === 0 && !isLoading && (
          <div className="error-state">
            <p>No se encontraron restaurantes.</p>
          </div>
        )}
      </div>
      {/* Address selector sheet */}
      {showAddressSheet && (
        <div
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'flex-end', zIndex: 1000, maxWidth: 430, margin: '0 auto' }}
          onClick={() => setShowAddressSheet(false)}
        >
          <div
            style={{ background: '#181B21', borderRadius: '16px 16px 0 0', width: '100%', padding: 20, maxHeight: '70vh', overflowY: 'auto' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <span style={{ fontSize: 15, fontWeight: 700, color: '#fff' }}>Mis Direcciones</span>
              <button onClick={() => setShowAddressSheet(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9A9DA8' }}>
                <X size={20} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {addresses.map((addr) => (
                <button
                  key={addr.name}
                  onClick={() => { setFavorite(addr.name); setShowAddressSheet(false) }}
                  style={{
                    background: addr.favorite ? 'rgba(90,138,58,0.1)' : '#23272F',
                    border: addr.favorite ? '1px solid #5A8A3A' : '1px solid transparent',
                    borderRadius: 12, padding: 14,
                    textAlign: 'left', cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: 4,
                  }}
                >
                  <span style={{ fontSize: 13, fontWeight: 600, color: '#fff', display: 'flex', alignItems: 'center', gap: 8 }}>
                    {addr.name}
                    {addr.favorite && (
                      <span style={{ fontSize: 10, color: '#5A8A3A', background: 'rgba(90,138,58,0.15)', borderRadius: 6, padding: '1px 6px' }}>
                        FAVORITA
                      </span>
                    )}
                  </span>
                  <span style={{ fontSize: 12, color: '#9A9DA8', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {addr.address}
                  </span>
                </button>
              ))}

              <AddressPicker
                onSave={(result: SavedAddress) => {
                  addAddress({ ...result, favorite: false })
                  setShowAddressSheet(false)
                }}
                trigger={
                  <button
                    style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                      background: 'transparent', border: '1.5px dashed #5A8A3A',
                      borderRadius: 12, padding: '12px 16px', cursor: 'pointer',
                      color: '#5A8A3A', fontSize: 13, fontWeight: 600, width: '100%',
                    }}
                  >
                    <Plus size={15} />
                    Agregar dirección
                  </button>
                }
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
