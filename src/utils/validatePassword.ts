/**
 * Checks if a password meets security requirements.
 *
 * Requirements:
 * - Minimum length of 8 characters
 * - Contains at least one uppercase letter
 * - Contains at least one lowercase letter
 * - Contains at least one number
 * - Contains at least one special character
 *
 * @param password The password to check
 * @returns An object with validation result and an error message if invalid
 */
export function validatePassword(password: string): {
  isValid: boolean
  error: string
} {
  // Check minimum length
  if (password.length < 8) {
    return { isValid: false, error: 'Password must be at least 8 characters long' }
  }

  // Check for uppercase letters
  if (!/[A-Z]/.test(password)) {
    return { isValid: false, error: 'Password must contain at least one uppercase letter' }
  }

  // Check for lowercase letters
  if (!/[a-z]/.test(password)) {
    return { isValid: false, error: 'Password must contain at least one lowercase letter' }
  }

  // Check for numbers
  if (!/[0-9]/.test(password)) {
    return { isValid: false, error: 'Password must contain at least one number' }
  }

  // Check for special characters
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    return { isValid: false, error: 'Password must contain at least one special character' }
  }

  return { isValid: true, error: '' }
}
