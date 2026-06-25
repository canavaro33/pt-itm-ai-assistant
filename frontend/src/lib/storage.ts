/**
 * Auth token storage utility.
 * Uses sessionStorage (tab-scoped, cleared on browser close) +
 * a cookie (readable by Next.js middleware for server-side route guards).
 */

const TOKEN_KEY = 'token';
const COOKIE_NAME = 'auth_token';
const COOKIE_MAX_AGE = 8 * 60 * 60; // 8 hours in seconds
const IS_PRODUCTION = typeof window !== 'undefined' && window.location.protocol === 'https:';
const COOKIE_FLAGS = IS_PRODUCTION ? '; Secure; SameSite=None' : '; SameSite=Lax';

export function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return sessionStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string): void {
  if (typeof window === 'undefined') return;
  sessionStorage.setItem(TOKEN_KEY, token);
  // Also set cookie so middleware can read it server-side
  document.cookie = `${COOKIE_NAME}=${token}; path=/; max-age=${COOKIE_MAX_AGE}${COOKIE_FLAGS}`;
}

export function removeToken(): void {
  if (typeof window === 'undefined') return;
  sessionStorage.removeItem(TOKEN_KEY);
  // Expire the cookie immediately
  document.cookie = `${COOKIE_NAME}=; path=/; max-age=0${COOKIE_FLAGS}`;
}
