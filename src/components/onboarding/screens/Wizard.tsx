'use client'

import { useOnboarding } from '../OnboardingContext'
import { TOTAL_STEPS } from '../constants'
import { ArrowLeft, ArrowRight, CheckIcon } from '../icons'
import PersonalStep from '../steps/PersonalStep'
import ContactStep from '../steps/ContactStep'
import LanguagesRoleStep from '../steps/LanguagesRoleStep'
import MediaStep from '../steps/MediaStep'
import SetupStep from '../steps/SetupStep'
import AvailabilityStep from '../steps/AvailabilityStep'
import ResumeStep from '../steps/ResumeStep'

const STEPS = [
  PersonalStep,
  ContactStep,
  LanguagesRoleStep,
  MediaStep,
  SetupStep,
  AvailabilityStep,
  ResumeStep,
]

export default function Wizard() {
  const { step, next, back, submitting, submitError, goScreen } = useOnboarding()
  const StepComponent = STEPS[step - 1]
  const isLast = step === TOTAL_STEPS

  return (
    <div className="ob-cardbox">
      <div className="ob-step-body" key={step}>
        <StepComponent />
      </div>

      {isLast && submitError && (
        <div
          className="ob-callout"
          style={{ borderColor: 'var(--rc-bad)', color: 'var(--rc-bad)' }}
        >
          <p>
            {submitError.message}
            {submitError.code === 'EMAIL_TAKEN' && (
              <>
                {' '}
                <button
                  type="button"
                  className="ob-textlink"
                  onClick={() => goScreen('login')}
                  style={{ fontWeight: 600 }}
                >
                  Sign in instead →
                </button>
              </>
            )}
          </p>
        </div>
      )}

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
            disabled={submitting}
            style={{ visibility: step === 1 ? 'hidden' : 'visible' }}
          >
            <ArrowLeft /> Back
          </button>
          <button className="ob-btn ob-btn-primary sm" onClick={next} disabled={submitting}>
            {submitting ? 'Submitting…' : isLast ? 'Submit application' : 'Continue'}
            <span className="pip">
              <ArrowRight />
            </span>
          </button>
        </div>
      </div>

      {isLast && submitting && (
        <p className="ob-hint" style={{ textAlign: 'right', padding: '0 4px 8px' }}>
          Uploading your photo and video — this can take a minute on slower connections.
        </p>
      )}
    </div>
  )
}
