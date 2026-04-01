import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { MapPin, CreditCard, ChevronDown, CheckCircle } from 'lucide-react'
import { useMutation } from '@tanstack/react-query'
import { ordersApi } from '../api/orders'
import { useCartStore } from '../store/cartStore'
import { useAuthStore } from '../store/authStore'
import { PageHeader } from '../components/PageHeader'

export function Checkout() {
  const navigate = useNavigate()
  const items = useCartStore((s) => s.items)
  const total = useCartStore((s) => s.total())
  const clearCart = useCartStore((s) => s.clearCart)
  const user = useAuthStore((s) => s.user)

  const [address, setAddress] = useState('Av. Insurgentes Sur 1234, Col. Del Valle, CDMX')
  const [phone, setPhone] = useState('')
  const [notes, setNotes] = useState('')
  const [showSummary, setShowSummary] = useState(false)

  const { mutate: createOrder, isPending } = useMutation({
    mutationFn: ordersApi.create,
    onSuccess: (order) => {
      clearCart()
      navigate(`/estado-pedido/${order._id}`)
    },
  })

  function handleConfirm() {
    createOrder({
      name: user?.name ?? 'Cliente',
      address,
      phone: phone || '5500000000',
      quantity: items.reduce((sum, i) => sum + i.quantity, 0),
      products: items.flatMap((i) => Array(i.quantity).fill(i.product._id)),
    })
  }

  return (
    <div className="page--no-nav">
      <PageHeader title="Checkout" />

      <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: 12 }}>
        {/* Delivery address */}
        <div style={{ background: '#181B21', borderRadius: 14, padding: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
            <span style={{ fontSize: 11, color: '#9A9DA8', textTransform: 'uppercase', letterSpacing: 0.5 }}>
              Dirección de entrega
            </span>
            <button
              style={{ background: 'none', border: 'none', color: '#5A8A3A', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}
            >
              Cambiar
            </button>
          </div>
          <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
            <MapPin size={16} color="#5A8A3A" style={{ flexShrink: 0, marginTop: 2 }} />
            <input
              className="input"
              style={{ background: 'transparent', border: 'none', padding: '0', fontSize: 14, color: '#fff' }}
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>
        </div>

        {/* Phone */}
        <div style={{ background: '#181B21', borderRadius: 14, padding: 14 }}>
          <span style={{ fontSize: 11, color: '#9A9DA8', textTransform: 'uppercase', letterSpacing: 0.5, display: 'block', marginBottom: 10 }}>
            Teléfono de contacto
          </span>
          <input
            className="input"
            style={{ background: 'transparent', border: 'none', padding: '0', fontSize: 14 }}
            placeholder="55 0000 0000"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            type="tel"
          />
        </div>

        {/* Payment method */}
        <div style={{ background: '#181B21', borderRadius: 14, padding: 14 }}>
          <span style={{ fontSize: 11, color: '#9A9DA8', textTransform: 'uppercase', letterSpacing: 0.5, display: 'block', marginBottom: 10 }}>
            Método de pago
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <CreditCard size={16} color="#5A8A3A" />
            <span style={{ fontSize: 14, color: '#fff', fontWeight: 500 }}>Pago en Efectivo</span>
          </div>
        </div>

        {/* Order summary */}
        <div style={{ background: '#181B21', borderRadius: 14, overflow: 'hidden' }}>
          <button
            onClick={() => setShowSummary(!showSummary)}
            style={{
              width: '100%',
              padding: 14,
              background: 'none',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              cursor: 'pointer',
              color: '#fff',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <CheckCircle size={16} color="#5A8A3A" />
              <span style={{ fontSize: 14, fontWeight: 600 }}>Resumen del Pedido</span>
              <span style={{ fontSize: 12, color: '#9A9DA8' }}>{items.length} items</span>
            </div>
            <ChevronDown size={16} color="#9A9DA8" style={{ transform: showSummary ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
          </button>
          {showSummary && (
            <div style={{ padding: '0 14px 14px', display: 'flex', flexDirection: 'column', gap: 6 }}>
              {items.map((i) => (
                <div key={i.product._id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: '#9A9DA8' }}>
                  <span>{i.product.name} x{i.quantity}</span>
                  <span>${(i.product.price * i.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Notes */}
        <div style={{ background: '#181B21', borderRadius: 14, padding: 14 }}>
          <span style={{ fontSize: 11, color: '#9A9DA8', textTransform: 'uppercase', letterSpacing: 0.5, display: 'block', marginBottom: 10 }}>
            Instrucciones especiales
          </span>
          <textarea
            className="input"
            style={{ background: 'transparent', border: 'none', padding: 0, resize: 'none', height: 60, fontSize: 13 }}
            placeholder="Sin cebolla, extra salsa verde..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>

        {/* Total and confirm */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '4px 0' }}>
          <span style={{ fontSize: 17, fontWeight: 700 }}>Total a Pagar</span>
          <span style={{ fontSize: 22, fontWeight: 800, color: '#5A8A3A' }}>${total.toFixed(2)}</span>
        </div>

        <button
          className="btn-primary"
          onClick={handleConfirm}
          disabled={isPending || items.length === 0}
          style={{ marginBottom: 16 }}
        >
          <CheckCircle size={18} />
          {isPending ? 'Procesando...' : 'Confirmar Pedido'}
        </button>
      </div>
    </div>
  )
}
