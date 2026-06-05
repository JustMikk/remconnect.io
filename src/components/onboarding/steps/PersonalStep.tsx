'use client'

import { TextField, SelectField } from '../fields'
import { EthFlag, LockSmall } from '../icons'

export default function PersonalStep() {
  return (
    <div className="ob-steppane">
      <div className="ob-step-head">
        <span className="ob-eyebrow">
          <span className="ln" />
          Personal
        </span>
        <h2>
          Let&apos;s start with the <em>basics</em>.
        </h2>
        <p>Your legal details, used for age verification and your contract once you&apos;re placed.</p>
      </div>
      <div className="ob-step-inner">
        <div className="ob-grid-3">
          <TextField fieldKey="pFirst" label="First name" placeholder="e.g. Liya" required />
          <TextField fieldKey="pMiddle" label="Middle name" optional />
          <TextField fieldKey="pLast" label="Last name" placeholder="e.g. Demeke" required />
        </div>
        <div className="ob-grid-2">
          <TextField fieldKey="pDob" label="Date of birth" type="date" required />
          <SelectField fieldKey="pGender" label="Gender" required>
            <option>Male</option>
            <option>Female</option>
            <option>Non-binary</option>
            <option>Prefer not to say</option>
          </SelectField>
        </div>
        <div className="ob-field">
          <label className="ob-label">Nationality</label>
          <div className="ob-readonly">
            <EthFlag />
            <span className="v">Ethiopian</span>
            <span className="lk">
              <LockSmall />
              Fixed
            </span>
          </div>
        </div>
        <div className="ob-grid-2">
          <TextField fieldKey="pCity" label="City" placeholder="e.g. Addis Ababa" required />
          <TextField fieldKey="pAddr" label="Home address" placeholder="Subcity, Woreda, Street / House No." required />
        </div>
      </div>
    </div>
  )
}
