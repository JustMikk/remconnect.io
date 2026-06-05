'use client'

import { useOnboarding } from '../OnboardingContext'
import { TOTAL_STEPS } from '../constants'
import { ArrowLeft, ArrowRight, CheckIcon } from '../icons'
import PersonalStep from '../steps/PersonalStep'
import ContactStep from '../steps/ContactStep'
import LanguagesRoleStep from '../steps/LanguagesRoleStep'
import ResumeStep from '../steps/ResumeStep'
import SetupStep from '../steps/SetupStep'
import AvailabilityStep from '../steps/AvailabilityStep'

const STEPS = [PersonalStep, ContactStep, LanguagesRoleStep, ResumeStep, SetupStep, AvailabilityStep]

export default function Wizard() {
  const { step, next, back } = useOnboarding()
  const StepComponent = STEPS[step - 1]
  const isLast = step === TOTAL_STEPS

  return (
    <div className="ob-cardbox">
      <div className="ob-step-body" key={step}>
        <StepComponent />
      </div>

      <div className="ob-cardfoot">
        <span className="ob-saved">
          <span className="ic">
            <CheckIcon size={11} strokeWidth={3} />
          </span>
          Progress saved
        </span>
        <div className="ob-footer-r">
          <button
            className="ob-btn ob-btn-ghost sm icon-left"
            onClick={back}
            style={{ visibility: step === 1 ? 'hidden' : 'visible' }}
          >
            <ArrowLeft /> Back
          </button>
          <button className="ob-btn ob-btn-primary sm" onClick={next}>
            {isLast ? 'Submit application' : 'Continue'}
            <span className="pip">
              <ArrowRight />
            </span>
          </button>
        </div>
      </div>
    </div>
  )
}
