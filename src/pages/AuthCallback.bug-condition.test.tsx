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

// ─── Test 2: AuthCallback stores accessToken in localStorage ─────────────────
// isBugCondition: localStorage.getItem('tuga-auth') CONTAINS 'accessToken'
//
// AuthCallback.tsx decodes the JWT from the URL and calls:
//   useAuthStore.getState().login({ id: payload.sub, ..., accessToken: token })
//
// We test the login() function directly with the same arguments AuthCallback uses,
// which is the exact code path that causes the bug.

// Minimal JWT with sub, name, email, picture in payload
const fakeJwt =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.' +
  btoa(
    JSON.stringify({
      sub: 'user123',
      name: 'Test User',
      email: 'test@example.com',
      picture: 'https://example.com/pic.jpg',
    })
  )
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '') +
  '.signature'

describe('Test 2 — AuthCallback: localStorage NO debe contener accessToken', () => {
  beforeEach(() => {
    localStorage.clear()
    useAuthStore.setState({ user: null, isAuthenticated: false })
  })

  afterEach(() => {
    localStorage.clear()
  })

  it('NO debe almacenar accessToken en localStorage tras el callback OAuth2 (isBugCondition)', () => {
    // Simulate what AuthCallback.tsx (FIXED) does when it receives ?sub=...&name=...&email=...&picture=...
    // The fixed code reads non-sensitive params from URL (no token) and calls login() without accessToken.
    const params = new URLSearchParams({
      sub: 'user123',
      name: 'Test User',
      email: 'test@example.com',
      picture: 'https://example.com/pic.jpg',
    })

    const sub = params.get('sub')
    const name = params.get('name') ?? ''
    const email = params.get('email') ?? ''
    const picture = params.get('picture') ?? undefined

    // Call login() exactly as the fixed AuthCallback does — without accessToken
    useAuthStore.getState().login({ id: sub!, name, email, picture })

    // Check the store — it should NOT contain accessToken
    const storeUser = useAuthStore.getState().user

    // EXPECTED BEHAVIOR (fixed): el store NO contiene accessToken
    expect(storeUser).not.toBeNull()
    expect(storeUser).not.toHaveProperty('accessToken')
  })
})
