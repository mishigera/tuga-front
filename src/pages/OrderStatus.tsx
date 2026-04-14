import { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { CheckCircle, Clock, Truck, ChevronDown, ChevronLeft } from 'lucide-react'
import { ordersApi } from '../api/orders'
import { normalize } from '../api/client'
import type { Order, Product } from '../types'

type StepKey = 'confirmed' | 'preparing' | 'delivery'

interface Step {
  key: StepKey
  label: string
  icon: typeof CheckCircle
  description: string
}

const STEPS: Step[] = [
  { key: 'confirmed', label: 'Pedido Confirmado', icon: CheckCircle, description: 'Confirmado por el restaurante' },
  { key: 'preparing', label: 'En Preparación', icon: Clock, description: 'Estimado: 10-15 min' },
  { key: 'delivery', label: 'En Reparto', icon: Truck, description: 'En camino a tu dirección' },
]

const TERMINAL_STATUSES = new Set(['delivered', 'success', 'cancelled'])

function statusToIndex(status?: string): number {
  switch (status) {
    case 'received': return 1
    case 'cocking':  return 1
    case 'shipped':  return 2
    case 'delivered':
    case 'success':  return 3
    case 'pending':
    default:         return 0
  }
}

export function OrderStatus() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const queryClient = useQueryClient()

  const { data: order, isLoading, isError } = useQuery({
    queryKey: ['order', id],
    queryFn: () => ordersApi.getById(id!),
    enabled: !!id,
  })

  // SSE via EventSource. Backend sends:
  // "data: " + JSON.stringify({ order_update: orderId, order }) + "\n\n"
  useEffect(() => {
    const orderId = order?._id
    if (!id || !orderId) return
    if (TERMINAL_STATUSES.has(order.status ?? '')) return

    let errorCount = 0
    const MAX_RETRIES = 3

    const es = new EventSource(`/api/orders/notifications/${id}`)

    es.onmessage = (event: MessageEvent) => {
      errorCount = 0
      try {
        const { order: updated } = JSON.parse(event.data) as {
          order_update: string
          order: Order
        }
        queryClient.setQueryData(['order', id], normalize(updated))
        if (updated.status && TERMINAL_STATUSES.has(updated.status)) {
          es.close()
        }
      } catch {
        // malformed message — ignore
      }
    }

    es.onerror = () => {
      errorCount++
      if (errorCount >= MAX_RETRIES) {
        es.close()
      }
    }

    return () => es.close()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, order?._id, queryClient])

  const currentIndex = statusToIndex(order?.status)

  const orderNumber = id?.slice(-4).toUpperCase() ?? '0000'

  function getProductName(p: string | Product) {
    return typeof p === 'string' ? `Producto #${p.slice(-4)}` : p.name
  }

  function getProductPrice(p: string | Product) {
    return typeof p === 'string' ? 0 : p.price
  }

  return (
    <div className="page--no-nav">
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '16px 16px 12px' }}>
        <button
          onClick={() => navigate('/pedidos')}
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
          <ChevronLeft size={20} color="#fff" />
        </button>
        <h1 style={{ fontSize: 20, fontWeight: 800 }}>Tu Pedido</h1>
      </div>

      {isLoading ? (
        <div className="spinner" />
      ) : isError ? (
        <div className="error-state">
          <p style={{ fontWeight: 600 }}>No se pudo cargar el pedido</p>
          <button className="btn-secondary" style={{ marginTop: 8, width: 'auto', padding: '10px 20px' }} onClick={() => navigate('/pedidos')}>
            Ver mis pedidos
          </button>
        </div>
      ) : (
        <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Order number */}
          <div style={{ textAlign: 'center', padding: '16px 0' }}>
            <span style={{ fontSize: 12, color: '#9A9DA8', textTransform: 'uppercase', letterSpacing: 1 }}>
              Número de Orden
            </span>
            <div style={{ fontSize: 36, fontWeight: 900, marginTop: 4 }}>
              #{orderNumber}
            </div>
          </div>

          {/* Cancelled banner */}
          {order?.status === 'cancelled' && (
            <div style={{ background: 'rgba(231,76,60,0.1)', border: '1px solid rgba(231,76,60,0.3)', borderRadius: 14, padding: '14px 16px', textAlign: 'center' }}>
              <span style={{ color: '#E74C3C', fontWeight: 700, fontSize: 15 }}>Pedido Cancelado</span>
            </div>
          )}

          {/* Steps */}
          <div style={{ background: '#181B21', borderRadius: 14, padding: '16px 20px' }}>
            {STEPS.map((step, i) => {
              const isCompleted = i < currentIndex
              const isActive = i === currentIndex
              const isPending = i > currentIndex
              const Icon = step.icon

              return (
                <div key={step.key} style={{ display: 'flex', gap: 14, marginBottom: i < STEPS.length - 1 ? 20 : 0 }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div style={{
                      width: 28,
                      height: 28,
                      borderRadius: '50%',
                      background: isCompleted ? '#5A8A3A' : isActive ? '#5A8A3A' : '#252830',
                      border: isActive ? '2px solid #5A8A3A' : 'none',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}>
                      <Icon size={14} color={isPending ? '#5A5D68' : '#fff'} />
                    </div>
                    {i < STEPS.length - 1 && (
                      <div style={{
                        width: 2,
                        flex: 1,
                        background: isCompleted ? '#5A8A3A' : '#252830',
                        marginTop: 4,
                        marginBottom: -12,
                        minHeight: 24,
                      }} />
                    )}
                  </div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: isPending ? '#5A5D68' : '#fff' }}>
                      {step.label}
                    </div>
                    <div style={{ fontSize: 12, color: '#9A9DA8', marginTop: 2 }}>
                      {step.description}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* ETA */}
          <div style={{ background: '#181B21', borderRadius: 14, padding: '14px 16px' }}>
            <span style={{ fontSize: 11, color: '#9A9DA8', textTransform: 'uppercase', letterSpacing: 0.5, display: 'block', marginBottom: 8 }}>
              Tiempo Estimado
            </span>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 28, fontWeight: 800 }}>25-35 min</span>
              <Clock size={24} color="#5A8A3A" />
            </div>
          </div>

          {/* Order summary */}
          {order && (
            <div style={{ background: '#181B21', borderRadius: 14, overflow: 'hidden' }}>
              <div style={{ padding: '14px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 14, fontWeight: 600 }}>Resumen del Pedido</span>
                <ChevronDown size={16} color="#9A9DA8" />
              </div>
              <div style={{ padding: '0 16px 14px', display: 'flex', flexDirection: 'column', gap: 8 }}>
                {order.products.map((p, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: '#9A9DA8' }}>
                    <span>1x {getProductName(p)}</span>
                    <span>${getProductPrice(p).toFixed(2)}</span>
                  </div>
                ))}
                <div style={{ height: 1, background: '#252830', margin: '4px 0' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700 }}>
                  <span>Total Pagado</span>
                  <span style={{ color: '#5A8A3A' }}>
                    ${order.products.reduce((sum, p) => sum + getProductPrice(p), 0).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
