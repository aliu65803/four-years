function getErrorDetails(error: unknown) {
  if (error instanceof Error) {
    return {
      message: error.message
    };
  }

  if (typeof error === "object" && error !== null) {
    const candidate = error as Record<string, unknown>;

    return {
      message: typeof candidate.message === "string" ? candidate.message : "unknown",
      code: typeof candidate.code === "string" ? candidate.code : undefined,
      details: typeof candidate.details === "string" ? candidate.details : undefined,
      hint: typeof candidate.hint === "string" ? candidate.hint : undefined
    };
  }

  return {
    message: typeof error === "string" ? error : "unknown"
  };
}

export function logSecurityEvent(event: string, details: Record<string, unknown>) {
  console.warn(`[security] ${event}`, details);
}

export function logServerError(event: string, error: unknown, details: Record<string, unknown> = {}) {
  console.error(`[server] ${event}`, {
    ...details,
    error: getErrorDetails(error)
  });
}

export function logModelUsage(details: Record<string, unknown>) {
  console.info("[ai] flavor_dialogue", details);
}
