import { useState } from 'react'
import { Plus } from 'lucide-react'
import { useCartStore } from '../store/cartStore'
import type { Product } from '../types'

interface Props {
  product: Product
}

const FOOD_IMAGES = [
  'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=200&q=80',
  'https://images.unsplash.com/photo-1565299507177-b0ac66763828?w=200&q=80',
  'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=200&q=80',
  'https://images.unsplash.com/photo-1599490659213-e2b9527bd087?w=200&q=80',
]

function getProductImage(id: string, imageUri?: string) {
  if (imageUri) return imageUri
  const idx = id.charCodeAt(id.length - 1) % FOOD_IMAGES.length
  return FOOD_IMAGES[idx]
}

export function MenuItemCard({ product }: Props) {
  const addItem = useCartStore((s) => s.addItem)
  const [pulse, setPulse] = useState(false)

  function handleAdd() {
    addItem(product)
    setPulse(true)
    setTimeout(() => setPulse(false), 200)
  }

  return (
    <div style={{
      display: 'flex',
      gap: 12,
      padding: '14px 16px',
      borderBottom: '1px solid #252830',
      alignItems: 'center',
    }}>
      <img
        src={getProductImage(product._id, product.imageUri)}
        alt={product.name}
        style={{ width: 72, height: 72, borderRadius: 12, objectFit: 'cover', flexShrink: 0 }}
      />
      <div style={{ flex: 1, minWidth: 0 }}>
        <h4 style={{ fontSize: 15, fontWeight: 600, marginBottom: 4, color: '#fff' }}>
          {product.name}
        </h4>
        <p style={{ fontSize: 12, color: '#9A9DA8', marginBottom: 8, lineHeight: 1.4 }}>
          {product.description}
        </p>
        <span style={{ fontSize: 15, fontWeight: 700, color: '#5A8A3A' }}>
          ${product.price.toFixed(2)}
        </span>
      </div>
      <button
        onClick={handleAdd}
        className={pulse ? 'btn--pulse' : undefined}
        style={{
          background: '#5A8A3A',
          border: 'none',
          borderRadius: 10,
          width: 32,
          height: 32,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          flexShrink: 0,
        }}
      >
        <Plus size={18} color="#fff" strokeWidth={2.5} />
      </button>
    </div>
  )
}
