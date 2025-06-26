export function defaultFormatter(level: string, message: string, meta: Record<string, any>) {
  return {
    level,
    message,
    meta,
    timestamp: new Date().toISOString(),
  };
}
