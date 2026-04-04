/**
 * Bug Condition Exploration Tests — Task 1
 *
 * Validates: Requirements 1.1, 1.2, 1.3
 *
 * CRITICAL: These tests MUST FAIL on unfixed code.
 * Failure confirms the bug exists.
 * DO NOT fix the code or the tests when they fail.
 */

import { describe, it, expect, beforeEach } from 'vitest'
import { useAuthStore } from '../store/authStore'

// ─── Test 3: api/client reads accessToken from localStorage ──────────────────
// isBugCondition: getAuthHeader() reads accessToken from store (localStorage) and
// attaches it in the Authorization header

describe('Test 3 — api/client: getAuthHeader NO debe leer accessToken del store', () => {
  beforeEach(() => {
    localStorage.clear()
    useAuthStore.setState({ user: null, isAuthenticated: false })
  })

  it('NO debe existir la función getAuthHeader que lee accessToken del store (isBugCondition)', async () => {
    const fakeToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.payload.signature'

    // Seed the store with a user that has accessToken (current bug state)
    useAuthStore.setState({
      user: {
        id: 'user123',
        name: 'Test User',
        email: 'test@example.com',
        accessToken: fakeToken,
      } as any,
      isAuthenticated: true,
    })

    // Dynamically import client to get the module-level getAuthHeader behavior
    // We test the observable effect: does a fetch call include Authorization header?
    const fetchCalls: RequestInit[] = []
    const originalFetch = globalThis.fetch
    globalThis.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
      fetchCalls.push(init ?? {})
      return new Response(JSON.stringify({}), { status: 200 })
    }

    try {
      const { api } = await import('./client')
      await api.get('/shops').catch(() => {})

      expect(fetchCalls.length).toBeGreaterThan(0)
      const headers = fetchCalls[0].headers as Record<string, string> | undefined

      // BUG CONDITION: el cliente adjunta Authorization: Bearer <token> desde localStorage
      // Este test FALLA en código sin fix porque getAuthHeader() lee accessToken del store
      expect(headers).not.toHaveProperty('Authorization')
    } finally {
      globalThis.fetch = originalFetch
    }
  })
})
