import { useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { ShoppingBag, ArrowRight, RefreshCw } from 'lucide-react'
import { ordersApi } from '../api/orders'
import type { Order, Product } from '../types'

function getProductName(p: string | Product) {
  return typeof p === 'string' ? `Producto #${p.slice(-4)}` : p.name
}

function getOrderTotal(order: Order) {
  return order.products.reduce((sum, p) => {
    return sum + (typeof p === 'string' ? 0 : p.price)
  }, 0)
}

function formatDate(iso?: string) {
  if (!iso) return ''
  return new Date(iso).toLocaleDateString('es-MX', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function Orders() {
  const navigate = useNavigate()

  const { data: orders, isLoading, isError } = useQuery({
    queryKey: ['orders'],
    queryFn: ordersApi.getAll,
    refetchInterval: 30000,
  })

  const sorted = [...(orders ?? [])].sort((a, b) =>
    new Date(b.createdAt ?? 0).getTime() - new Date(a.createdAt ?? 0).getTime()
  )

  const active = sorted.slice(0, 1)
  const previous = sorted.slice(1)

  return (
    <div className="page">
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 16px 20px' }}>
        <span style={{ fontSize: 11, color: '#9A9DA8', textTransform: 'uppercase', letterSpacing: 1 }}>
          Mis Pedidos
        </span>
        {orders && orders.length > 0 && (
          <span style={{
            background: '#5A8A3A',
            color: '#fff',
            borderRadius: '50%',
            width: 22,
            height: 22,
            fontSize: 12,
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            {orders.length}
          </span>
        )}
      </div>

      {isLoading && <div className="spinner" />}

      {isError && (
        <div className="error-state">
          <p>No se pudieron cargar los pedidos.</p>
        </div>
      )}

      {!isLoading && orders?.length === 0 && (
        <div className="error-state" style={{ minHeight: '60vh' }}>
          <ShoppingBag size={48} color="#5A5D68" />
          <p style={{ fontWeight: 600 }}>Sin pedidos aún</p>
          <p style={{ fontSize: 13 }}>Tus pedidos aparecerán aquí</p>
        </div>
      )}

      <div style={{ padding: '0 16px' }}>
        {/* Active order */}
        {active.map((order) => (
          <div key={order._id} style={{
            background: '#181B21',
            borderRadius: 16,
            padding: 16,
            marginBottom: 20,
            border: '1px solid rgba(90,138,58,0.3)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
              <span style={{ fontSize: 15, fontWeight: 700 }}>Pedido #{order._id.slice(-4).toUpperCase()}</span>
              <span className="badge badge--active">ACTIVO</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#5A8A3A', fontSize: 13, marginBottom: 12 }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#5A8A3A', display: 'inline-block' }} />
              En Preparación
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginBottom: 14 }}>
              {order.products.slice(0, 3).map((p, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: '#9A9DA8' }}>
                  <span>{getProductName(p)} x1</span>
                  <span>—</span>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <span style={{ fontSize: 14, color: '#9A9DA8' }}>Total</span>
              <span style={{ fontSize: 18, fontWeight: 800, color: '#5A8A3A' }}>
                ${getOrderTotal(order).toFixed(2)}
              </span>
            </div>
            <button
              className="btn-primary"
              onClick={() => navigate(`/estado-pedido/${order._id}`)}
            >
              Ver Estado <ArrowRight size={16} />
            </button>
          </div>
        ))}

        {/* Previous orders */}
        {previous.length > 0 && (
          <>
            <span style={{ fontSize: 11, color: '#9A9DA8', textTransform: 'uppercase', letterSpacing: 0.5, display: 'block', marginBottom: 12 }}>
              Pedidos Anteriores
            </span>
            {previous.map((order) => (
              <div key={order._id} style={{
                background: '#181B21',
                borderRadius: 14,
                padding: 14,
                marginBottom: 10,
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{ fontSize: 14, fontWeight: 600 }}>Pedido #{order._id.slice(-4).toUpperCase()}</span>
                  <span className="badge badge--done">FINALIZADO</span>
                </div>
                <p style={{ fontSize: 12, color: '#9A9DA8', marginBottom: 8 }}>
                  {formatDate(order.createdAt)}
                </p>
                <p style={{ fontSize: 12, color: '#9A9DA8', marginBottom: 10 }}>
                  {order.products.slice(0, 2).map(getProductName).join(', ')}
                  {order.products.length > 2 && ` +${order.products.length - 2} más`}
                </p>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: 16, fontWeight: 700 }}>
                    ${getOrderTotal(order).toFixed(2)}
                  </span>
                  <button
                    onClick={() => navigate(`/estado-pedido/${order._id}`)}
                    style={{
                      background: '#252830',
                      border: 'none',
                      borderRadius: 8,
                      padding: '8px 12px',
                      color: '#9A9DA8',
                      fontSize: 12,
                      fontWeight: 600,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6,
                    }}
                  >
                    <RefreshCw size={13} />
                    Repetir
                  </button>
                </div>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  )
}
