// Institutional delivery adapter. No provider is configured in this project.
// A future adapter receives { email, token, expiresAt }, builds the link below,
// and sends it privately. Never log or return tokens to HTTP clients.
export function passwordResetUrl(token) {
  const base = new URL(process.env.CLIENT_URL);
  if (!['http:', 'https:'].includes(base.protocol) ||
      (process.env.NODE_ENV === 'production' && base.protocol !== 'https:')) {
    throw new Error('Invalid recovery client URL');
  }
  const url = new URL('/reset-password', base);
  url.searchParams.set('token', token);
  return url.href;
}

export async function deliverPasswordReset(_delivery) {
  // Deliberately unavailable: no SMTP credentials, console sink or HTTP fallback.
  return false;
}
