const getEnv = import.meta.env as Record<string, string | undefined>

export function env(key: string): string {
  const value = getEnv[key]

  if (value === undefined || value === "") {
    throw new Error(`Missing required environment variable: ${key}`)
  }

  return value
}
