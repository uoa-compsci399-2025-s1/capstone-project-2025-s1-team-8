/**
 * This function uses the RFC2822 email validator to test for email formats
 * https://www.rfc-editor.org/rfc/rfc2822.html#section-3.4.1
 *
 * @param email - The email address to validate.
 * @returns whether the email address is valid or not.
 */
export const isValidEmail = (email: string): boolean => {
  return /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/i.test(
    email,
  )
}

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
export function isValidPassword(password: string): {
  isValid: boolean
  error: string
} {
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

  // Check minimum length
  if (password.length < 8) {
    return { isValid: false, error: 'Password must be at least 8 characters long' }
  }

  return { isValid: true, error: '' }
}
