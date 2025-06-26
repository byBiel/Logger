export function userFormatter(level: string, message: string, meta: Record<string, any>) {
  return {
    timestamp: new Date().toISOString(),
    level,
    user: meta.userId,
    action: meta.action,
    details: meta.details || {},
  };
}
