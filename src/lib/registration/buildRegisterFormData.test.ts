import { describe, expect, it } from 'vitest'
import type { FormFields, OnboardingFiles } from '@/components/onboarding/constants'
import {
  buildRegisterFormData,
  normalizePhone,
  type RegistrationInput,
} from './buildRegisterFormData'

const FIELDS: FormFields = {
  crEmail: ' liya@example.com ',
  crPass: 'Secret123',
  crPass2: 'Secret123',
  crRole: 'Customer Support Agent',
  lgEmail: '',
  lgPass: '',
  pFirst: 'Liya',
  pMiddle: '',
  pLast: 'Demeke',
  pNickname: '',
  pDob: '1998-04-15',
  pGender: 'Female',
  pCity: 'Addis Ababa',
  pAddr: 'Bole, Woreda 03',
  cEmail: 'liya@example.com',
  cPhone: '911 234 567',
  netSpeed: '10–25 Mbps',
  aSalary: '18,000',
  aHear: 'Facebook',
  aLinkedin: '',
}

const FILES: OnboardingFiles = {
  avatar: new File(['img'], 'me.png', { type: 'image/png' }),
  introVideo: new File(['vid'], 'intro.mp4', { type: 'video/mp4' }),
  resume: null,
}

function makeInput(overrides: Partial<RegistrationInput> = {}): RegistrationInput {
  return {
    fields: FIELDS,
    roles: [{ r: 'Customer Support Agent', exp: '1–2 years' }],
    langs: [
      { l: 'Amharic', p: 'Native' },
      { l: 'English', p: 'Fluent' },
      { l: '  ', p: 'Basic' },
    ],
    certs: [
      {
        id: 1,
        name: 'Google IT Support',
        org: 'Coursera',
        earned: '2023-06-01',
        expiry: '',
        url: '',
      },
      { id: 2, name: '   ', org: '', earned: '', expiry: '', url: '' },
    ],
    checks: ['Wired internet (LAN)', 'Headset', '2nd monitor'],
    emp: 'Full-time',
    files: FILES,
    roleIds: new Map([['Customer Support Agent', 'uuid-cs-1']]),
    ...overrides,
  }
}

describe('buildRegisterFormData', () => {
  it('maps scalar fields with trimming and enum translation', () => {
    const form = buildRegisterFormData(makeInput())

    expect(form.get('email')).toBe('liya@example.com')
    expect(form.get('password')).toBe('Secret123')
    expect(form.get('firstName')).toBe('Liya')
    expect(form.get('lastName')).toBe('Demeke')
    expect(form.get('dateOfBirth')).toBe('1998-04-15')
    expect(form.get('gender')).toBe('FEMALE')
    expect(form.get('phone')).toBe('+251911234567')
    expect(form.get('employmentType')).toBe('FULL_TIME')
    expect(form.get('expectedSalaryEtb')).toBe('18000')
    expect(form.get('hearAboutUs')).toBe('Facebook')
    expect(form.has('middleName')).toBe(false)
    expect(form.has('linkedinUrl')).toBe(false)
  })

  it('serializes languages with API proficiency enums, dropping blank rows', () => {
    const form = buildRegisterFormData(makeInput())

    expect(JSON.parse(form.get('languages') as string)).toEqual([
      { language: 'Amharic', proficiency: 'NATIVE' },
      { language: 'English', proficiency: 'FLUENT' },
    ])
  })

  it('serializes certifications without empty optional keys', () => {
    const form = buildRegisterFormData(makeInput())

    expect(JSON.parse(form.get('certifications') as string)).toEqual([
      { name: 'Google IT Support', issuingOrg: 'Coursera', dateEarned: '2023-06-01' },
    ])
  })

  it('buckets remote-setup checks into grouped slugs with internet speed', () => {
    const form = buildRegisterFormData(makeInput())

    expect(JSON.parse(form.get('remoteSetup') as string)).toEqual({
      connectivity: ['wired_internet_lan'],
      hardware: ['second_monitor', 'headset'],
      internetSpeed: '10–25 Mbps',
    })
  })

  it('resolves desired role ids from titles, deduped, omitting unknown titles', () => {
    const form = buildRegisterFormData(makeInput())

    expect(JSON.parse(form.get('desiredRoleIds') as string)).toEqual(['uuid-cs-1'])
  })

  it('omits desiredRoleIds entirely when the catalog is empty (fallback roles)', () => {
    const form = buildRegisterFormData(makeInput({ roleIds: new Map() }))

    expect(form.has('desiredRoleIds')).toBe(false)
  })

  it('attaches required files and skips the missing resume', () => {
    const form = buildRegisterFormData(makeInput())

    expect(form.get('avatar')).toBeInstanceOf(File)
    expect(form.get('introVideo')).toBeInstanceOf(File)
    expect(form.has('resume')).toBe(false)
  })
})

describe('normalizePhone', () => {
  it('handles local 9-digit numbers', () => {
    expect(normalizePhone('911 234 567')).toBe('+251911234567')
  })
  it('handles 0-prefixed 10-digit numbers', () => {
    expect(normalizePhone('0911234567')).toBe('+251911234567')
  })
  it('handles numbers already carrying the country code', () => {
    expect(normalizePhone('+251 911 234 567')).toBe('+251911234567')
  })
  it('returns undefined for empty input', () => {
    expect(normalizePhone('  ')).toBeUndefined()
  })
})
