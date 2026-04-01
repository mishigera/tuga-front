import { useNavigate } from 'react-router-dom'
import { ShoppingCart, ArrowRight } from 'lucide-react'
import { useCartStore } from '../store/cartStore'
import { CartItemRow } from '../components/CartItemRow'
import { PageHeader } from '../components/PageHeader'

export function Cart() {
  const navigate = useNavigate()
  const items = useCartStore((s) => s.items)
  const total = useCartStore((s) => s.total())

  return (
    <div className="page--no-nav">
      <PageHeader title="Tu Carrito" />

      <div style={{ padding: '8px 16px' }}>
        {items.length === 0 ? (
          <div className="error-state" style={{ minHeight: '60vh' }}>
            <ShoppingCart size={48} color="#5A5D68" />
            <p style={{ fontWeight: 600 }}>Tu carrito está vacío</p>
            <p style={{ fontSize: 13 }}>Agrega productos de tus restaurantes favoritos</p>
            <button
              className="btn-primary"
              onClick={() => navigate('/')}
              style={{ marginTop: 8, width: 'auto', padding: '12px 24px' }}
            >
              Explorar restaurantes
            </button>
          </div>
        ) : (
          <>
            {items.map((item) => (
              <CartItemRow key={item.product._id} item={item} />
            ))}

            {/* Totals */}
            <div style={{
              background: '#181B21',
              borderRadius: 14,
              padding: 16,
              marginTop: 8,
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10, color: '#9A9DA8', fontSize: 14 }}>
                <span>Subtotal</span>
                <span>${total.toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                <span style={{ fontSize: 17, fontWeight: 700 }}>Total</span>
                <span style={{ fontSize: 20, fontWeight: 800, color: '#5A8A3A' }}>
                  ${total.toFixed(2)}
                </span>
              </div>
              <button
                className="btn-primary"
                onClick={() => navigate('/checkout')}
              >
                Proceder al Pago <ArrowRight size={16} />
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
