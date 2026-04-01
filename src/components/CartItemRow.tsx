import { Minus, Plus, Trash2 } from 'lucide-react'
import { useCartStore } from '../store/cartStore'
import type { CartItem } from '../types'

interface Props {
  item: CartItem
}

export function CartItemRow({ item }: Props) {
  const { updateQuantity, removeItem } = useCartStore()

  return (
    <div style={{
      background: '#181B21',
      borderRadius: 14,
      padding: '14px 16px',
      marginBottom: 10,
      display: 'flex',
      alignItems: 'center',
      gap: 12,
    }}>
      <div style={{ flex: 1 }}>
        <h4 style={{ fontSize: 15, fontWeight: 600, marginBottom: 2, color: '#fff' }}>
          {item.product.name}
        </h4>
        <p style={{ fontSize: 12, color: '#9A9DA8', marginBottom: 8 }}>
          {item.product.description.slice(0, 40)}
        </p>
        <span style={{ fontSize: 15, fontWeight: 700, color: '#5A8A3A' }}>
          ${(item.product.price * item.quantity).toFixed(2)}
        </span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <button
          onClick={() => updateQuantity(item.product._id, item.quantity - 1)}
          style={{
            background: '#252830',
            border: 'none',
            borderRadius: 8,
            width: 30,
            height: 30,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
          }}
        >
          <Minus size={14} color="#fff" />
        </button>
        <span style={{ fontSize: 15, fontWeight: 600, minWidth: 20, textAlign: 'center' }}>
          {item.quantity}
        </span>
        <button
          onClick={() => updateQuantity(item.product._id, item.quantity + 1)}
          style={{
            background: '#5A8A3A',
            border: 'none',
            borderRadius: 8,
            width: 30,
            height: 30,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
          }}
        >
          <Plus size={14} color="#fff" />
        </button>
      </div>
      <button
        onClick={() => removeItem(item.product._id)}
        style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}
      >
        <Trash2 size={16} color="#5A5D68" />
      </button>
    </div>
  )
}
