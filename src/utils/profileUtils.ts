import type { Coupon } from '../types/index'

export function applyDiscount(total: number, coupon: Coupon | null): number {
  if (!coupon) return total
  if (coupon.discountType === 'percentage') {
    return total * (1 - coupon.discountValue / 100)
  }
  return Math.max(0, total - coupon.discountValue)
}

export function normalizeFileName(file: File): string {
  const hasExtension = /\.[a-zA-Z0-9]+$/.test(file.name)
  return hasExtension ? file.name : `${file.name}.jpg`
}

export function validateCoupon(coupons: Coupon[], code: string): Coupon | null {
  return coupons.find(c => c.code === code) ?? null
}

export function getInviteMessage(): string {
  return 'ingresa a la app tuga y gana un descuento especial por ser mi amigo'
}
