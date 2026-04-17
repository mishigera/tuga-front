import { useState } from 'react'
import { Heart, Clock } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useFavoritesStore } from '../store/authStore'
import type { Shop } from '../types'

interface Props {
  shop: Shop
}

const PLACEHOLDER_IMAGES = [
  'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&q=80',
  'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&q=80',
  'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&q=80',
  'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&q=80',
]

function getPlaceholderImage(id: string | undefined) {
  if (!id) return PLACEHOLDER_IMAGES[0]
  const idx = id.charCodeAt(id.length - 1) % PLACEHOLDER_IMAGES.length
  return PLACEHOLDER_IMAGES[idx]
}

export function RestaurantCard({ shop }: Props) {
  const navigate = useNavigate()
  const { toggle, isFavorite } = useFavoritesStore()
  const shopId = shop._id ?? shop.id ?? ''
  const fav = isFavorite(shopId)
  const [pressed, setPressed] = useState(false)

  const img = shop.imageuri || getPlaceholderImage(shopId)
  const closed = shop.isOpen === false

  return (
    <div
      className={`card${pressed ? ' card--pressed' : ''}`}
      style={{ cursor: closed ? 'default' : 'pointer', marginBottom: 16, opacity: closed ? 0.5 : 1, pointerEvents: closed ? 'none' : 'auto' }}
      onClick={() => !closed && navigate(`/restaurante/${shopId}`)}
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
      onMouseLeave={() => setPressed(false)}
      onTouchStart={() => setPressed(true)}
      onTouchEnd={() => setPressed(false)}
    >
      <div style={{ position: 'relative', height: 160 }}>
        <img
          src={img}
          alt={shop.name}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
        {closed && (
          <div style={{
            position: 'absolute', inset: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'rgba(0,0,0,0.4)',
          }}>
            <span style={{
              background: 'rgba(14,16,20,0.85)',
              color: '#E74C3C',
              fontSize: 14,
              fontWeight: 700,
              padding: '6px 16px',
              borderRadius: 8,
              letterSpacing: 0.5,
            }}>
              Cerrado
            </span>
          </div>
        )}
        <button
          onClick={(e) => { e.stopPropagation(); toggle(shopId) }}
          style={{
            position: 'absolute',
            top: 10,
            right: 10,
            background: 'rgba(0,0,0,0.5)',
            border: 'none',
            borderRadius: '50%',
            width: 34,
            height: 34,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: fav ? '#E74C3C' : '#fff',
          }}
        >
          <Heart size={16} fill={fav ? '#E74C3C' : 'none'} />
        </button>
      </div>
      <div style={{ padding: '14px 16px 16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: '#fff' }}>{shop.name}</h3>
          <span className="badge badge--green">
            {shop.categories ?? 'categoría'}
          </span>
        </div>
        <p style={{ fontSize: 13, color: '#9A9DA8', marginBottom: 10, lineHeight: 1.4 }}>
          {shop.description}
        </p>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#9A9DA8', fontSize: 12 }}>
          <Clock size={13} />
          <span>25-35 min</span>
        </div>
      </div>
    </div>
  )
}
