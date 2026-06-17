import { describe, expect, it } from 'vitest'
import { decodeAccessToken, isExpired } from './jwt'

function makeToken(payload: object): string {
  const segment = Buffer.from(JSON.stringify(payload))
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '')
  return `header.${segment}.signature`
}

describe('decodeAccessToken', () => {
  it('decodes a valid payload', () => {
    const token = makeToken({
      sub: 'user-1',
      email: 'a@b.c',
      role: 'ADMIN',
      iat: 1_781_241_752,
      exp: 1_781_846_552,
    })

    expect(decodeAccessToken(token)).toEqual({
      sub: 'user-1',
      email: 'a@b.c',
      role: 'ADMIN',
      iat: 1_781_241_752,
      exp: 1_781_846_552,
    })
  })

  it('rejects tokens with an unknown role', () => {
    expect(decodeAccessToken(makeToken({ sub: 'u', role: 'SUPERUSER', exp: 1 }))).toBeNull()
  })

  it('rejects tokens missing required claims', () => {
    expect(decodeAccessToken(makeToken({ sub: 'u', role: 'AGENT' }))).toBeNull()
    expect(decodeAccessToken(makeToken({ role: 'AGENT', exp: 1 }))).toBeNull()
  })

  it('rejects malformed input', () => {
    expect(decodeAccessToken('not-a-jwt')).toBeNull()
    expect(decodeAccessToken('a.b')).toBeNull()
    expect(decodeAccessToken('a.%%%.c')).toBeNull()
  })
})

describe('isExpired', () => {
  const now = Math.floor(Date.now() / 1000)

  it('is false for a token expiring well in the future', () => {
    expect(isExpired({ sub: 'u', role: 'AGENT', exp: now + 3600 })).toBe(false)
  })

  it('is true for a past expiry', () => {
    expect(isExpired({ sub: 'u', role: 'AGENT', exp: now - 10 })).toBe(true)
  })

  it('treats tokens inside the skew window as expired', () => {
    expect(isExpired({ sub: 'u', role: 'AGENT', exp: now + 10 }, 30)).toBe(true)
  })
})
