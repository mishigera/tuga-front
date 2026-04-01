import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Search, ShoppingCart } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { shopsApi } from '../api/shops'
import { RestaurantCard } from '../components/RestaurantCard'
import { useAuthStore } from '../store/authStore'
import { useCartStore } from '../store/cartStore'

const CATEGORIES = ['Todos', 'Comida', 'Bebidas', 'Postres']

export function Home() {
  const navigate = useNavigate()
  const user = useAuthStore((s) => s.user)
  const totalItems = useCartStore((s) => s.totalItems())
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('Todos')

  const { data: shops, isLoading, isError } = useQuery({
    queryKey: ['shops'],
    queryFn: shopsApi.getAll,
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
        <h1 style={{ fontSize: 26, fontWeight: 800, marginBottom: 20, letterSpacing: -0.5 }}>
          Hola, {user?.name ?? 'Usuario'} 👋
        </h1>

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

        {/* Category Pills */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 20, overflowX: 'auto', paddingBottom: 4 }}>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
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
        </div>
      </div>

      {/* Restaurant List */}
      <div style={{ padding: '0 16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: '#9A9DA8', textTransform: 'uppercase', letterSpacing: 0.5 }}>
            Restaurantes
          </span>
          <button style={{ background: 'none', border: 'none', color: '#5A8A3A', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
            Ver todos
          </button>
        </div>

        {isLoading && <div className="spinner" />}

        {isError && (
          <div className="error-state">
            <p>No se pudo cargar los restaurantes.</p>
            <p style={{ fontSize: 12 }}>Verifica que el backend esté corriendo en el puerto 3000.</p>
          </div>
        )}

        {filtered?.map((shop, i) => (
          <RestaurantCard key={shop._id ?? shop.id ?? i} shop={shop} />
        ))}

        {filtered?.length === 0 && !isLoading && (
          <div className="error-state">
            <p>No se encontraron restaurantes.</p>
          </div>
        )}
      </div>
    </div>
  )
}
