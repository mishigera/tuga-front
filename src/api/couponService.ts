import type { Coupon } from '../types'
import { validateCoupon } from '../utils/profileUtils'

// Cuando el backend esté listo, reemplazar por:
// getAvailable: api.get<Coupon[]>('/coupons')
// validate:     api.post<Coupon | null>('/coupons/validate', { code })

const MOCK_COUPONS: Coupon[] = [
  {
    code: 'TUGA10',
    description: '10% de descuento en tu pedido',
    discountType: 'percentage',
    discountValue: 10,
    expiresAt: '2099-12-31T00:00:00Z',
  },
  {
    code: 'BIENVENIDO',
    description: '$50 de descuento en tu primer pedido',
    discountType: 'fixed',
    discountValue: 50,
    expiresAt: '2099-12-31T00:00:00Z',
  },
  {
    code: 'AMIGO20',
    description: '20% de descuento por referido',
    discountType: 'percentage',
    discountValue: 20,
    expiresAt: '2099-12-31T00:00:00Z',
  },
]

const delay = (ms = 300) => new Promise<void>(resolve => setTimeout(resolve, ms))

export const couponService = {
  async getAvailable(): Promise<Coupon[]> {
    await delay()
    return [...MOCK_COUPONS]
  },

  async validate(code: string): Promise<Coupon | null> {
    await delay()
    return validateCoupon(MOCK_COUPONS, code)
  },
}
