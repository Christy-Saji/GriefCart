const inFlight = new Set<string>()

export const acquireLock = (sessionKey: string): boolean => {
  if (inFlight.has(sessionKey)) return false
  inFlight.add(sessionKey)
  return true
}

export const releaseLock = (sessionKey: string): void => {
  inFlight.delete(sessionKey)
}
