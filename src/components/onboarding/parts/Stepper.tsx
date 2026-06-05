'use client'

import { useOnboarding } from '../OnboardingContext'
import { STEP_NAMES, TOTAL_STEPS } from '../constants'
import { CheckIcon } from '../icons'

export default function Stepper() {
  const { step, goStep, validateStep } = useOnboarding()

  const jump = (target: number) => {
    if (target <= step) {
      goStep(target) // step back freely
    } else if (validateStep(step)) {
      goStep(target) // forward only when the current step is valid
    }
  }

  return (
    <div className="ob-stepper-wrap">
      <div className="ob-step-mobile">
        Step {step} of {TOTAL_STEPS} · {STEP_NAMES[step - 1]}
      </div>
      <ol className="ob-stepper">
        {STEP_NAMES.map((name, i) => {
          const n = i + 1
          const done = n < step
          const active = n === step
          return (
            <li
              key={name}
              className={`ob-sstep${active ? ' active' : ''}${done ? ' done' : ''}`}
              onClick={() => jump(n)}
            >
              <span className="b">{done ? <CheckIcon size={13} strokeWidth={3} /> : n}</span>
              <span className="l">{name}</span>
            </li>
          )
        })}
      </ol>
    </div>
  )
}
