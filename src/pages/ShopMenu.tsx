import { useState, useRef, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Heart, Clock, ShoppingCart } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { shopsApi } from '../api/shops'
import { productsApi } from '../api/products'
import { MenuItemCard } from '../components/MenuItemCard'
import { SkeletonCard } from '../components/SkeletonCard'
import { useFavoritesStore } from '../store/authStore'
import { useCartStore } from '../store/cartStore'
import { useStaggerAnimation } from '../hooks/useStaggerAnimation'

const HERO_IMAGES = [
  'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&q=80',
  'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&q=80',
  'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=80',
]

export function ShopMenu() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [tab, setTab] = useState('Todos')
  const [heartPulse, setHeartPulse] = useState(false)
  const [cartAnimClass, setCartAnimClass] = useState('')
  const prevTotalItemsRef = useRef(0)
  const { toggle, isFavorite } = useFavoritesStore()
  const totalItems = useCartStore((s) => s.totalItems())

  const { data: shop } = useQuery({
    queryKey: ['shop', id],
    queryFn: () => shopsApi.getById(id!),
    enabled: !!id,
  })

  const { data: products, isLoading } = useQuery({
    queryKey: ['products', id],
    queryFn: () => productsApi.getByShop(id!),
    enabled: !!id,
  })

  const fav = isFavorite(id ?? '')
  const heroImg = shop?.imageuri || HERO_IMAGES[(id?.charCodeAt(id.length - 1) ?? 0) % HERO_IMAGES.length]

  const uniqueCategories = [...new Set(products?.flatMap((p) => p.categories ?? []))]
  const tabs = ['Todos', ...uniqueCategories]
  const filtered = tab === 'Todos'
    ? products
    : products?.filter((p) => p.categories?.includes(tab))

  const stagger = useStaggerAnimation({
    itemCount: products?.length ?? 0,
    delayMs: 40,
    durationMs: 300,
    enabled: !isLoading,
    key: `shop-products-${id}`,
  })

  useEffect(() => {
    const prev = prevTotalItemsRef.current
    if (prev === 0 && totalItems > 0) {
      setCartAnimClass('cart-enter')
      const t = setTimeout(() => setCartAnimClass(''), 250)
      return () => clearTimeout(t)
    } else if (prev > 0 && totalItems === 0) {
      setCartAnimClass('cart-exit')
      const t = setTimeout(() => setCartAnimClass(''), 200)
      return () => clearTimeout(t)
    }
    prevTotalItemsRef.current = totalItems
  }, [totalItems])

  return (
    <div className="page--no-nav" style={{ paddingBottom: totalItems > 0 ? 90 : 0 }}>
      {/* Hero image with back button */}
      <div style={{ position: 'relative', height: 200 }}>
        <img src={heroImg} alt={shop?.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0.4) 0%, transparent 60%)' }} />
        <button
          onClick={() => navigate(-1)}
          style={{
            position: 'absolute',
            top: 16,
            left: 16,
            background: 'rgba(0,0,0,0.5)',
            border: 'none',
            borderRadius: '50%',
            width: 36,
            height: 36,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: '#fff',
            fontSize: 18,
          }}
        >
          ←
        </button>
        <button
          onClick={() => {
            toggle(id ?? '')
            setHeartPulse(true)
            setTimeout(() => setHeartPulse(false), 250)
          }}
          style={{
            position: 'absolute',
            top: 16,
            right: 16,
            background: 'rgba(0,0,0,0.5)',
            border: 'none',
            borderRadius: '50%',
            width: 36,
            height: 36,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: fav ? '#E74C3C' : '#fff',
          }}
        >
          <Heart size={16} fill={fav ? '#E74C3C' : 'none'} className={heartPulse ? 'heart--pulse' : undefined} />
        </button>
      </div>

      {/* Shop Info */}
      <div style={{ padding: '16px 16px 0' }}>
        <h1 style={{ fontSize: 22, fontWeight: 800, marginBottom: 8 }}>
          {shop?.name ?? 'Cargando...'}
        </h1>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 10 }}>
          <span className="badge badge--green">{shop?.categories ?? 'Restaurante'}</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#9A9DA8', fontSize: 13 }}>
            <Clock size={13} /> 25-35 min
          </span>
        </div>
        <p style={{ color: '#9A9DA8', fontSize: 14, lineHeight: 1.5, marginBottom: 16 }}>
          {shop?.description}
        </p>

        {/* Tabs */}
        {tabs.length > 1 && (
          <div className="tabs-scroll" style={{ display: 'flex', overflowX: 'auto', borderBottom: '1px solid #252830', marginBottom: 4, WebkitOverflowScrolling: 'touch' }}>
            {tabs.map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                style={{
                  padding: '10px 14px',
                  border: 'none',
                  background: 'none',
                  color: tab === t ? '#5A8A3A' : '#9A9DA8',
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: 'pointer',
                  borderBottom: tab === t ? '2px solid #5A8A3A' : '2px solid transparent',
                  marginBottom: -1,
                  whiteSpace: 'nowrap',
                  flexShrink: 0,
                }}
              >
                {t}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Products */}
      {isLoading && (
        <>
          <SkeletonCard variant="menu-item" />
          <SkeletonCard variant="menu-item" />
          <SkeletonCard variant="menu-item" />
          <SkeletonCard variant="menu-item" />
        </>
      )}
      {filtered?.map((p, i) => (
        <div key={p._id} className={stagger.className} style={stagger.getItemStyle(i)}>
          <MenuItemCard product={p} />
        </div>
      ))}
      {filtered?.length === 0 && !isLoading && (
        <div className="error-state">
          <p>Sin productos disponibles.</p>
        </div>
      )}

      {/* Floating Cart button */}
      {totalItems > 0 && (
        <div style={{ position: 'fixed', bottom: 20, left: '50%', transform: 'translateX(-50%)', width: 'calc(100% - 32px)', maxWidth: 398, zIndex: 50 }}>
          <button
            className={`btn-primary ${cartAnimClass} cart-pulse`.trim()}
            onClick={() => navigate('/carrito')}
            style={{ boxShadow: '0 4px 20px rgba(90,138,58,0.4)' }}
          >
            <ShoppingCart size={18} />
            Ver carrito ({totalItems} items)
          </button>
        </div>
      )}
    </div>
  )
}
