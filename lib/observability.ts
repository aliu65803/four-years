export function logSecurityEvent(event: string, details: Record<string, unknown>) {
  console.warn(`[security] ${event}`, details);
}

export function logServerError(event: string, error: unknown, details: Record<string, unknown> = {}) {
  console.error(`[server] ${event}`, {
    ...details,
    error: error instanceof Error ? error.message : "unknown"
  });
}

export function logModelUsage(details: Record<string, unknown>) {
  console.info("[ai] flavor_dialogue", details);
}
