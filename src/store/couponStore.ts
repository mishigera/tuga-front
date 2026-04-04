import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Coupon } from '../types'

interface CouponState {
  available: Coupon[]
  active: Coupon | null
  setAvailable: (coupons: Coupon[]) => void
  activate: (coupon: Coupon) => void
  deactivate: () => void
}

export const useCouponStore = create<CouponState>()(
  persist(
    (set) => ({
      available: [],
      active: null,

      setAvailable: (coupons) => set({ available: coupons }),

      activate: (coupon) => set({ active: coupon }),

      deactivate: () => set({ active: null }),
    }),
    {
      name: 'tuga-coupons',
    }
  )
)
