import type { Metadata } from 'next'
import './onboarding.css'
import Onboarding from '@/components/onboarding/Onboarding'
import type { Screen } from '@/components/onboarding/constants'
import { getRoleCategories } from '@/lib/data/roles'

export const metadata: Metadata = {
  title: 'RemConnect — Apply & create your agent profile',
  description:
    'Create your RemConnect account and complete your agent application in about 10 minutes. Free to apply, free to train.',
}

// Allow deep-linking straight into sign-in (?screen=login) or the application
// form (?screen=apply). Anything else lands on the create-account screen.
function resolveScreen(value: string | string[] | undefined): Screen | undefined {
  const v = Array.isArray(value) ? value[0] : value
  if (v === 'login') return 'login'
  if (v === 'apply' || v === 'create') return 'create'
  return undefined
}

export default async function ApplyPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const sp = await searchParams

  // Role catalog comes from the backend; on failure (e.g. cold start) the
  // wizard falls back to its hardcoded role groups so /apply never breaks.
  const roleCategories = await getRoleCategories().catch(() => undefined)

  return <Onboarding initialScreen={resolveScreen(sp.screen)} roleCategories={roleCategories} />
}
