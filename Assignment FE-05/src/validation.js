const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const USERNAME_PATTERN = /^[a-zA-Z0-9_]+$/

export const TIMEZONES = [
  'UTC',
  'America/New_York',
  'America/Chicago',
  'America/Denver',
  'America/Los_Angeles',
  'Europe/London',
  'Europe/Berlin',
  'Asia/Karachi',
  'Asia/Kolkata',
  'Asia/Singapore',
  'Australia/Sydney',
]

export const THEMES = ['system', 'light', 'dark']

export const emptySettings = {
  displayName: '',
  email: '',
  username: '',
  timezone: 'UTC',
  theme: 'system',
  emailNotifications: true,
  productUpdates: false,
}

export function validateField(name, value) {
  const text = typeof value === 'string' ? value.trim() : value

  switch (name) {
    case 'displayName':
      if (!text) return 'Display name is required.'
      if (text.length < 2) return 'Display name must be at least 2 characters.'
      if (text.length > 50) return 'Display name must be 50 characters or fewer.'
      return ''
    case 'email':
      if (!text) return 'Email is required.'
      if (!EMAIL_PATTERN.test(text)) return 'Enter a valid email address.'
      return ''
    case 'username':
      if (!text) return 'Username is required.'
      if (text.length < 3) return 'Username must be at least 3 characters.'
      if (text.length > 20) return 'Username must be 20 characters or fewer.'
      if (!USERNAME_PATTERN.test(text)) {
        return 'Username can only include letters, numbers, and underscores.'
      }
      return ''
    case 'timezone':
      if (!TIMEZONES.includes(value)) return 'Choose a timezone from the list.'
      return ''
    case 'theme':
      if (!THEMES.includes(value)) return 'Choose a theme.'
      return ''
    default:
      return ''
  }
}

export function validateSettings(values) {
  const fieldNames = ['displayName', 'email', 'username', 'timezone', 'theme']
  const errors = {}

  for (const name of fieldNames) {
    const message = validateField(name, values[name])
    if (message) errors[name] = message
  }

  return errors
}

export function normalizeSettings(values) {
  return {
    displayName: values.displayName.trim(),
    email: values.email.trim(),
    username: values.username.trim(),
    timezone: values.timezone,
    theme: values.theme,
    emailNotifications: Boolean(values.emailNotifications),
    productUpdates: Boolean(values.productUpdates),
  }
}
