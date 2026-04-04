/**
 * Preservation Property Tests — Task 2
 *
 * Validates: Requirements 3.4
 *
 * IMPORTANT: These tests MUST PASS on unfixed code.
 * They confirm the baseline behavior that must be preserved after the fix.
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { useAuthStore } from './authStore'

// ─── Test 4: logout() limpia el store completamente ──────────────────────────
// Validates: Requirement 3.4
// Property: FOR ALL authenticated states, logout() always produces a clean store
describe('Test 4 — Logout: logout() limpia el store completamente', () => {
  beforeEach(() => {
    localStorage.clear()
    useAuthStore.setState({ user: null, isAuthenticated: false })
  })

  afterEach(() => {
    localStorage.clear()
  })

  it('logout() debe setear user a null', () => {
    useAuthStore.setState({
      user: {
        id: 'user123',
        name: 'Test User',
        email: 'test@example.com',
        picture: 'https://example.com/pic.jpg',
        accessToken: 'some-token',
      } as any,
      isAuthenticated: true,
    })

    useAuthStore.getState().logout()

    expect(useAuthStore.getState().user).toBeNull()
  })

  it('logout() debe setear isAuthenticated a false', () => {
    useAuthStore.setState({
      user: {
        id: 'user123',
        name: 'Test User',
        email: 'test@example.com',
        accessToken: 'some-token',
      } as any,
      isAuthenticated: true,
    })

    useAuthStore.getState().logout()

    expect(useAuthStore.getState().isAuthenticated).toBe(false)
  })

  it('logout() es idempotente — llamarlo dos veces no produce error', () => {
    useAuthStore.setState({
      user: {
        id: 'user123',
        name: 'Test User',
        email: 'test@example.com',
        accessToken: 'some-token',
      } as any,
      isAuthenticated: true,
    })

    useAuthStore.getState().logout()
    useAuthStore.getState().logout()

    expect(useAuthStore.getState().user).toBeNull()
    expect(useAuthStore.getState().isAuthenticated).toBe(false)
  })

  it('logout() desde estado ya limpio no produce error', () => {
    // Already clean state
    expect(useAuthStore.getState().user).toBeNull()
    expect(useAuthStore.getState().isAuthenticated).toBe(false)

    expect(() => useAuthStore.getState().logout()).not.toThrow()

    expect(useAuthStore.getState().user).toBeNull()
    expect(useAuthStore.getState().isAuthenticated).toBe(false)
  })

  // Property-based: for any user object, logout always produces clean state
  it('logout() limpia el store independientemente del contenido del usuario', () => {
    const userVariants = [
      { id: 'a', name: 'Alice', email: 'alice@example.com', accessToken: 'tok1' },
      { id: 'b', name: 'Bob', email: 'bob@example.com', picture: 'https://pic.com/b.jpg', accessToken: 'tok2' },
      { id: 'c', name: '', email: 'c@example.com', accessToken: '' },
    ]

    for (const user of userVariants) {
      useAuthStore.setState({ user: user as any, isAuthenticated: true })

      useAuthStore.getState().logout()

      expect(useAuthStore.getState().user).toBeNull()
      expect(useAuthStore.getState().isAuthenticated).toBe(false)
    }
  })
})
