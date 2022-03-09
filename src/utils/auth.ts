const TokenKey = 'Admin-Token'

export function getToken(): string | null {
  return localStorage.getItem(TokenKey);
}

export function setToken(token: string) {
  return localStorage.setItem(TokenKey, token)
}

export function removeToken() {
  return localStorage.removeItem(TokenKey)
}
