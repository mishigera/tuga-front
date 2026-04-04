import { useState, useEffect } from 'react'
import { Tag, CheckCircle, XCircle } from 'lucide-react'
import { useCouponStore } from '../store/couponStore'
import { couponService } from '../api/couponService'
import { validateCoupon } from '../utils/profileUtils'
import { PageHeader } from '../components/PageHeader'
import type { Coupon } from '../types'

function formatDate(iso: string): string {
  const d = new Date(iso)
  return d.toLocaleDateString('es-MX', { day: '2-digit', month: 'short', year: 'numeric' })
}

export function CouponManager() {
  const available = useCouponStore((s) => s.available)
  const active = useCouponStore((s) => s.active)
  const setAvailable = useCouponStore((s) => s.setAvailable)
  const activate = useCouponStore((s) => s.activate)
  const deactivate = useCouponStore((s) => s.deactivate)

  const [input, setInput] = useState('')
  const [feedback, setFeedback] = useState<{ ok: boolean; msg: string } | null>(null)

  // Tarea 7.1 — cargar cupones al montar
  useEffect(() => {
    couponService.getAvailable().then((data) => setAvailable(data))
  }, [setAvailable])

  // Tarea 7.2 — aplicar cupón
  function handleApply() {
    const code = input.trim().toUpperCase()
    const coupon = validateCoupon(available, code)
    if (coupon) {
      activate(coupon)
      setInput('')
      setFeedback({ ok: true, msg: `Cupón "${coupon.code}" aplicado correctamente.` })
    } else {
      setFeedback({ ok: false, msg: 'Cupón no válido o expirado.' })
    }
    setTimeout(() => setFeedback(null), 3500)
  }

  return (
    <div className="page--no-nav">
      <PageHeader title="Cupones y Promociones" />

      <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: 14 }}>

        {/* Tarea 7.2 — campo de ingreso */}
        <div style={{
          background: '#181B21',
          borderRadius: 16,
          padding: 16,
          display: 'flex',
          flexDirection: 'column',
          gap: 10,
        }}>
          <span style={{ fontSize: 11, color: '#9A9DA8', textTransform: 'uppercase', letterSpacing: 0.5 }}>
            Ingresar código
          </span>
          <div style={{ display: 'flex', gap: 8 }}>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleApply()}
              placeholder="Ej. TUGA10"
              style={{
                flex: 1,
                background: '#1E2128',
                border: '1px solid #2A2D35',
                borderRadius: 10,
                padding: '11px 13px',
                fontSize: 14,
                color: '#fff',
                outline: 'none',
              }}
            />
            <button
              onClick={handleApply}
              disabled={!input.trim()}
              style={{
                background: input.trim() ? '#5A8A3A' : '#2A2D35',
                border: 'none',
                borderRadius: 10,
                padding: '11px 18px',
                cursor: input.trim() ? 'pointer' : 'not-allowed',
                color: '#fff',
                fontSize: 14,
                fontWeight: 700,
                whiteSpace: 'nowrap',
              }}
            >
              Aplicar
            </button>
          </div>

          {/* Feedback */}
          {feedback && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              fontSize: 13,
              color: feedback.ok ? '#5A8A3A' : '#E74C3C',
              background: feedback.ok ? 'rgba(90,138,58,0.1)' : 'rgba(231,76,60,0.08)',
              border: `1px solid ${feedback.ok ? 'rgba(90,138,58,0.3)' : 'rgba(231,76,60,0.2)'}`,
              borderRadius: 8,
              padding: '8px 12px',
            }}>
              {feedback.ok
                ? <CheckCircle size={15} />
                : <XCircle size={15} />}
              {feedback.msg}
            </div>
          )}
        </div>

        {/* Tarea 7.1 — cupón activo destacado */}
        {active && (
          <div style={{
            background: 'rgba(90,138,58,0.12)',
            border: '1.5px solid #5A8A3A',
            borderRadius: 16,
            padding: 16,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
              <span style={{ fontSize: 11, color: '#5A8A3A', textTransform: 'uppercase', letterSpacing: 0.5, fontWeight: 700 }}>
                Cupón activo
              </span>
              {/* Tarea 7.3 — quitar cupón */}
              <button
                onClick={deactivate}
                style={{
                  background: 'rgba(231,76,60,0.1)',
                  border: '1px solid rgba(231,76,60,0.3)',
                  borderRadius: 8,
                  padding: '4px 10px',
                  cursor: 'pointer',
                  color: '#E74C3C',
                  fontSize: 12,
                  fontWeight: 600,
                }}
              >
                Quitar cupón
              </button>
            </div>
            <CouponCard coupon={active} isActive />
          </div>
        )}

        {/* Tarea 7.1 — lista de cupones disponibles */}
        {available.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <span style={{ fontSize: 11, color: '#9A9DA8', textTransform: 'uppercase', letterSpacing: 0.5 }}>
              Disponibles
            </span>
            {available.map((c) => (
              <CouponCard key={c.code} coupon={c} isActive={active?.code === c.code} />
            ))}
          </div>
        )}

        {available.length === 0 && (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: '48px 24px',
            gap: 14,
            textAlign: 'center',
          }}>
            <div style={{
              width: 64,
              height: 64,
              borderRadius: '50%',
              background: 'rgba(90,138,58,0.12)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <Tag size={28} color="#5A8A3A" />
            </div>
            <p style={{ fontSize: 16, fontWeight: 700, color: '#fff', margin: 0 }}>
              Sin cupones disponibles
            </p>
            <p style={{ fontSize: 13, color: '#9A9DA8', margin: 0, lineHeight: 1.5 }}>
              Ingresa un código arriba o espera nuevas promociones.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Sub-componente ──────────────────────────────────────────────────────────

interface CouponCardProps {
  coupon: Coupon
  isActive: boolean
}

function CouponCard({ coupon, isActive }: CouponCardProps) {
  const discountLabel = coupon.discountType === 'percentage'
    ? `${coupon.discountValue}% de descuento`
    : `$${coupon.discountValue} de descuento`

  return (
    <div style={{
      background: '#181B21',
      borderRadius: 14,
      padding: 14,
      border: isActive ? '1.5px solid #5A8A3A' : '1.5px solid transparent',
      display: 'flex',
      alignItems: 'flex-start',
      gap: 12,
    }}>
      <div style={{
        width: 36,
        height: 36,
        borderRadius: 10,
        background: 'rgba(90,138,58,0.12)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
      }}>
        <Tag size={16} color="#5A8A3A" />
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4, flexWrap: 'wrap' }}>
          {/* Badge código */}
          <span style={{
            fontSize: 12,
            fontWeight: 800,
            color: '#5A8A3A',
            background: 'rgba(90,138,58,0.15)',
            borderRadius: 6,
            padding: '3px 8px',
            letterSpacing: 0.5,
          }}>
            {coupon.code}
          </span>
          {isActive && (
            <span style={{
              fontSize: 10,
              fontWeight: 700,
              color: '#fff',
              background: '#5A8A3A',
              borderRadius: 6,
              padding: '2px 7px',
              letterSpacing: 0.3,
            }}>
              ACTIVO
            </span>
          )}
        </div>
        <p style={{ fontSize: 13, color: '#fff', margin: '0 0 2px', fontWeight: 600 }}>
          {discountLabel}
        </p>
        <p style={{ fontSize: 12, color: '#9A9DA8', margin: '0 0 4px', lineHeight: 1.4 }}>
          {coupon.description}
        </p>
        <p style={{ fontSize: 11, color: '#5A5D68', margin: 0 }}>
          Vence: {formatDate(coupon.expiresAt)}
        </p>
      </div>
    </div>
  )
}
