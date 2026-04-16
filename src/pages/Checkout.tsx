import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { MapPin, CreditCard, ChevronDown, CheckCircle, X, Plus } from 'lucide-react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { ordersApi } from '../api/orders'
import { useCartStore } from '../store/cartStore'
import { useAuthStore } from '../store/authStore'
import { useAddressStore } from '../store/addressStore'
import { useCouponStore } from '../store/couponStore'
import { applyDiscount } from '../utils/profileUtils'
import { PageHeader } from '../components/PageHeader'
import { AddressPicker } from '../components/addressPicker'
import type { SavedAddress } from '../types'

const ACTIVE_STATUSES = new Set(['pending', 'received', 'cocking', 'shipped', 'delivered'])

export function Checkout() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const items = useCartStore((s) => s.items)
  const total = useCartStore((s) => s.total())
  const clearCart = useCartStore((s) => s.clearCart)
  const user = useAuthStore((s) => s.user)

  const addresses = useAddressStore((s) => s.addresses)
  const getFavorite = useAddressStore((s) => s.getFavorite)
  const addAddress = useAddressStore((s) => s.addAddress)
  const activeCoupon = useCouponStore((s) => s.active)
  const discountedTotal = applyDiscount(total, activeCoupon)

  const favorite = getFavorite()

  const [selectedAddress, setSelectedAddress] = useState<SavedAddress | null>(favorite ?? null)
  const [phone, setPhone] = useState('')
  const [notes, setNotes] = useState('')
  const [showSummary, setShowSummary] = useState(false)
  const [showAddressPicker, setShowAddressPicker] = useState(false)

  // Sync selected address if favorite changes (e.g. after adding first address)
  useEffect(() => {
    if (!selectedAddress && favorite) setSelectedAddress(favorite)
  }, [favorite])

  // Check for active orders
  const { data: existingOrders } = useQuery({
    queryKey: ['orders'],
    queryFn: ordersApi.getAll,
  })

  const hasActiveOrder = existingOrders?.some(
    (o) => o.status && ACTIVE_STATUSES.has(o.status)
  ) ?? false

  const { mutate: createOrder, isPending } = useMutation({
    mutationFn: ordersApi.create,
    onSuccess: (order) => {
      clearCart()
      queryClient.invalidateQueries({ queryKey: ['orders'] })
      navigate(`/estado-pedido/${order._id}`)
    },
  })

  function handleConfirm() {
    if (!selectedAddress || hasActiveOrder || !user) return
    const firstShop = items[0]?.product.shop
    const shopId = typeof firstShop === 'string' ? firstShop : firstShop?._id ?? ''
    createOrder({
      name: user.name,
      address: selectedAddress.address,
      phone: phone || '5500000000',
      quantity: items.reduce((sum, i) => sum + i.quantity, 0),
      products: items.flatMap((i) => Array(i.quantity).fill(i.product._id)),
      shop: shopId,
      user: user.id,
      latitude: selectedAddress.latitude,
      longitude: selectedAddress.longitude,
    })
  }

  const canConfirm = !isPending && items.length > 0 && !!selectedAddress && !hasActiveOrder

  return (
    <div className="page--no-nav">
      <PageHeader title="Checkout" />

      <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: 12 }}>

        {/* Active order banner */}
        {hasActiveOrder && (
          <div style={{
            background: 'rgba(231,76,60,0.1)',
            border: '1px solid rgba(231,76,60,0.3)',
            borderRadius: 12,
            padding: '12px 14px',
            display: 'flex',
            alignItems: 'center',
            gap: 10,
          }}>
            <span style={{ fontSize: 18 }}>🛵</span>
            <span style={{ fontSize: 13, color: '#E74C3C', fontWeight: 600 }}>
              Ya tienes un pedido en camino. Espera a que se complete para hacer otro.
            </span>
          </div>
        )}

        {/* Delivery address */}
        <div style={{ background: '#181B21', borderRadius: 14, padding: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
            <span style={{ fontSize: 11, color: '#9A9DA8', textTransform: 'uppercase', letterSpacing: 0.5 }}>
              Dirección de entrega
            </span>
            {addresses.length > 0 && (
              <button
                onClick={() => setShowAddressPicker(true)}
                style={{ background: 'none', border: 'none', color: '#5A8A3A', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}
              >
                Cambiar
              </button>
            )}
          </div>

          {selectedAddress ? (
            <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
              <MapPin size={16} color="#5A8A3A" style={{ flexShrink: 0, marginTop: 2 }} />
              <div>
                <p style={{ fontSize: 14, fontWeight: 600, color: '#fff', margin: 0 }}>{selectedAddress.name}</p>
                <p style={{ fontSize: 12, color: '#9A9DA8', margin: '2px 0 0', lineHeight: 1.4 }}>{selectedAddress.address}</p>
              </div>
            </div>
          ) : (
            <AddressPicker
              onSave={(result) => {
                addAddress({ ...result, favorite: addresses.length === 0 })
                setSelectedAddress(result)
              }}
              trigger={
                <button
                  style={{
                    display: 'flex', alignItems: 'center', gap: 8, background: 'none',
                    border: '1px dashed #5A8A3A', borderRadius: 10, padding: '10px 14px',
                    cursor: 'pointer', color: '#5A8A3A', fontSize: 13, fontWeight: 600, width: '100%',
                  }}
                >
                  <Plus size={15} />
                  Agregar dirección de entrega
                </button>
              }
            />
          )}
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
              width: '100%', padding: 14, background: 'none', border: 'none',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              cursor: 'pointer', color: '#fff',
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
          {activeCoupon ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 2 }}>
              <span style={{ fontSize: 14, color: '#9A9DA8', textDecoration: 'line-through' }}>${total.toFixed(2)}</span>
              <span style={{ fontSize: 12, color: '#4CAF50' }}>
                -{activeCoupon.discountType === 'percentage' ? `${activeCoupon.discountValue}%` : `$${activeCoupon.discountValue.toFixed(2)}`} ({activeCoupon.code})
              </span>
              <span style={{ fontSize: 22, fontWeight: 800, color: '#5A8A3A' }}>${discountedTotal.toFixed(2)}</span>
            </div>
          ) : (
            <span style={{ fontSize: 22, fontWeight: 800, color: '#5A8A3A' }}>${total.toFixed(2)}</span>
          )}
        </div>

        <button
          className="btn-primary"
          onClick={handleConfirm}
          disabled={!canConfirm}
          style={{ marginBottom: 16 }}
        >
          <CheckCircle size={18} />
          {isPending ? 'Procesando...' : 'Confirmar Pedido'}
        </button>
      </div>

      {/* Address selector modal */}
      {showAddressPicker && (
        <div
          style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)',
            display: 'flex', alignItems: 'flex-end', zIndex: 1000,
            maxWidth: 430, margin: '0 auto',
          }}
          onClick={() => setShowAddressPicker(false)}
        >
          <div
            style={{ background: '#181B21', borderRadius: '16px 16px 0 0', width: '100%', padding: 20, maxHeight: '60vh', overflowY: 'auto' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <span style={{ fontSize: 15, fontWeight: 700, color: '#fff' }}>Seleccionar dirección</span>
              <button
                onClick={() => setShowAddressPicker(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9A9DA8' }}
              >
                <X size={20} />
              </button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {addresses.map((addr) => (
                <button
                  key={addr.name}
                  onClick={() => { setSelectedAddress(addr); setShowAddressPicker(false) }}
                  style={{
                    background: selectedAddress?.name === addr.name ? 'rgba(90,138,58,0.1)' : '#23272F',
                    border: selectedAddress?.name === addr.name ? '1px solid #5A8A3A' : '1px solid transparent',
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
                  <span style={{ fontSize: 12, color: '#9A9DA8' }}>{addr.address}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
