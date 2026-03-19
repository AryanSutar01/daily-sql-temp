const TOKEN_COOKIE = "ds_token";

/**
 * Save the JWT token as a browser cookie (7-day expiry).
 * This is a client-side cookie — for server reads use the Next.js cookies() API.
 */
export function saveToken(token: string): void {
    const expires = new Date();
    expires.setDate(expires.getDate() + 7);
    document.cookie = `${TOKEN_COOKIE}=${token}; expires=${expires.toUTCString()}; path=/; SameSite=Lax`;
}

/** Read the JWT token from the browser cookie. */
export function getToken(): string | null {
    if (typeof document === "undefined") return null;
    const match = document.cookie.match(new RegExp(`(?:^|; )${TOKEN_COOKIE}=([^;]*)`));
    return match ? decodeURIComponent(match[1]) : null;
}

/** Remove the token cookie (logout). */
export function clearToken(): void {
    document.cookie = `${TOKEN_COOKIE}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; SameSite=Lax`;
}

/** Returns true if a token cookie is currently set. */
export function isLoggedIn(): boolean {
    return getToken() !== null;
}
