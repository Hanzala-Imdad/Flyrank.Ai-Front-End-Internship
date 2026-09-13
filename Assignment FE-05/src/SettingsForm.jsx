import { useEffect, useState } from 'react'
import {
  TIMEZONES,
  emptySettings,
  normalizeSettings,
  validateField,
  validateSettings,
} from './validation'

const STORAGE_KEY = 'flyrank-settings'

function loadSavedSettings() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return emptySettings
    return { ...emptySettings, ...JSON.parse(raw) }
  } catch {
    return emptySettings
  }
}

export default function SettingsForm() {
  const [values, setValues] = useState(emptySettings)
  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})
  const [status, setStatus] = useState('')

  useEffect(() => {
    setValues(loadSavedSettings())
  }, [])

  function setField(name, value) {
    setValues((current) => ({ ...current, [name]: value }))
    setStatus('')

    if (touched[name]) {
      setErrors((current) => ({
        ...current,
        [name]: validateField(name, value),
      }))
    }
  }

  function handleBlur(event) {
    const { name } = event.target
    setTouched((current) => ({ ...current, [name]: true }))
    setErrors((current) => ({
      ...current,
      [name]: validateField(name, values[name]),
    }))
  }

  function handleChange(event) {
    const { name, type, checked, value } = event.target
    setField(name, type === 'checkbox' ? checked : value)
  }

  function handleSubmit(event) {
    event.preventDefault()

    const nextErrors = validateSettings(values)
    setErrors(nextErrors)
    setTouched({
      displayName: true,
      email: true,
      username: true,
      timezone: true,
      theme: true,
    })

    if (Object.keys(nextErrors).length > 0) {
      setStatus('error')
      const order = ['displayName', 'email', 'username', 'timezone', 'theme']
      const firstInvalid = order.find((name) => nextErrors[name])
      requestAnimationFrame(() => {
        document.getElementById(firstInvalid)?.focus()
      })
      return
    }

    const saved = normalizeSettings(values)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(saved))
    setValues(saved)
    setStatus('saved')
  }

  function fieldError(name) {
    return touched[name] ? errors[name] : ''
  }

  const formErrorCount = Object.values(errors).filter(Boolean).length

  return (
    <form className="settings-form" onSubmit={handleSubmit} noValidate>
      <header className="settings-header">
        <p className="eyebrow">Account</p>
        <h1>Settings</h1>
        <p className="lede">
          Update your profile and preferences. Required fields are marked with
          an asterisk.
        </p>
      </header>

      <fieldset>
        <legend>Profile</legend>

        <div className="field">
          <label htmlFor="displayName">
            Display name <span aria-hidden="true">*</span>
          </label>
          <input
            id="displayName"
            name="displayName"
            type="text"
            autoComplete="name"
            value={values.displayName}
            onChange={handleChange}
            onBlur={handleBlur}
            aria-invalid={Boolean(fieldError('displayName'))}
            aria-describedby={
              fieldError('displayName') ? 'displayName-error' : undefined
            }
          />
          {fieldError('displayName') ? (
            <p id="displayName-error" className="field-error" role="alert">
              {fieldError('displayName')}
            </p>
          ) : null}
        </div>

        <div className="field">
          <label htmlFor="email">
            Email <span aria-hidden="true">*</span>
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            value={values.email}
            onChange={handleChange}
            onBlur={handleBlur}
            aria-invalid={Boolean(fieldError('email'))}
            aria-describedby={fieldError('email') ? 'email-error' : undefined}
          />
          {fieldError('email') ? (
            <p id="email-error" className="field-error" role="alert">
              {fieldError('email')}
            </p>
          ) : null}
        </div>

        <div className="field">
          <label htmlFor="username">
            Username <span aria-hidden="true">*</span>
          </label>
          <input
            id="username"
            name="username"
            type="text"
            autoComplete="username"
            value={values.username}
            onChange={handleChange}
            onBlur={handleBlur}
            aria-invalid={Boolean(fieldError('username'))}
            aria-describedby={
              fieldError('username')
                ? 'username-hint username-error'
                : 'username-hint'
            }
          />
          <p id="username-hint" className="field-hint">
            3–20 characters. Letters, numbers, and underscores only.
          </p>
          {fieldError('username') ? (
            <p id="username-error" className="field-error" role="alert">
              {fieldError('username')}
            </p>
          ) : null}
        </div>
      </fieldset>

      <fieldset>
        <legend>Preferences</legend>

        <div className="field">
          <label htmlFor="timezone">Timezone</label>
          <select
            id="timezone"
            name="timezone"
            value={values.timezone}
            onChange={handleChange}
            onBlur={handleBlur}
            aria-invalid={Boolean(fieldError('timezone'))}
          >
            {TIMEZONES.map((zone) => (
              <option key={zone} value={zone}>
                {zone.replaceAll('_', ' ')}
              </option>
            ))}
          </select>
        </div>

        <div className="field">
          <span className="label" id="theme-label">
            Theme
          </span>
          <div
            className="radio-row"
            role="radiogroup"
            aria-labelledby="theme-label"
          >
            {['system', 'light', 'dark'].map((theme) => (
              <label key={theme} className="choice">
                <input
                  type="radio"
                  name="theme"
                  value={theme}
                  checked={values.theme === theme}
                  onChange={handleChange}
                />
                {theme}
              </label>
            ))}
          </div>
        </div>
      </fieldset>

      <fieldset>
        <legend>Notifications</legend>

        <label className="choice stacked">
          <input
            type="checkbox"
            name="emailNotifications"
            checked={values.emailNotifications}
            onChange={handleChange}
          />
          <span>
            Email notifications
            <span className="choice-note">
              Account activity and security alerts
            </span>
          </span>
        </label>

        <label className="choice stacked">
          <input
            type="checkbox"
            name="productUpdates"
            checked={values.productUpdates}
            onChange={handleChange}
          />
          <span>
            Product updates
            <span className="choice-note">Occasional news and feature tips</span>
          </span>
        </label>
      </fieldset>

      {status === 'error' ? (
        <p className="form-status error" role="alert">
          Fix {formErrorCount} {formErrorCount === 1 ? 'error' : 'errors'}{' '}
          before saving.
        </p>
      ) : null}

      {status === 'saved' ? (
        <p className="form-status success" role="status">
          Settings saved.
        </p>
      ) : null}

      <div className="actions">
        <button type="submit">Save settings</button>
      </div>
    </form>
  )
}
