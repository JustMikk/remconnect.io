'use client'

import { OnboardingProvider, useOnboarding } from './OnboardingContext'
import type { Screen } from './constants'
import AppBar from './parts/AppBar'
import Stepper from './parts/Stepper'
import CreateAccount from './screens/CreateAccount'
import VerifyEmail from './screens/VerifyEmail'
import Login from './screens/Login'
import Wizard from './screens/Wizard'
import Success from './screens/Success'

function CurrentScreen() {
  const { screen } = useOnboarding()
  switch (screen) {
    case 'create':
      return <CreateAccount />
    case 'verify':
      return <VerifyEmail />
    case 'login':
      return <Login />
    case 'wizard':
      return <Wizard />
    case 'success':
      return <Success />
    default:
      return <CreateAccount />
  }
}

function Shell() {
  const { screen } = useOnboarding()
  const mode = screen === 'wizard' ? 'wizard' : 'auth'
  return (
    <div className="ob" data-mode={mode}>
      <AppBar />
      <Stepper />
      <main className="ob-main">
        {/* key forces the fade-in animation to replay on screen change */}
        <section className="ob-screen" key={screen}>
          <CurrentScreen />
        </section>
      </main>
    </div>
  )
}

export default function Onboarding({ initialScreen }: { initialScreen?: Screen }) {
  return (
    <OnboardingProvider initialScreen={initialScreen}>
      <Shell />
    </OnboardingProvider>
  )
}
