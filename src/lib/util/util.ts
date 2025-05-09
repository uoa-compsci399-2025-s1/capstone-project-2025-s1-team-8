/**
 * This function uses the RFC2822 email validator to test for email formats
 * https://www.rfc-editor.org/rfc/rfc2822.html#section-3.4.1
 *
 * @param email - The email address to validate.
 * @returns whether the email address is valid or not.
 */
export function isValidEmail(email: string): boolean {
  return /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/.test(
    email,
  )
}
