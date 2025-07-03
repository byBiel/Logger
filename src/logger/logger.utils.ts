import { LogMeta } from './logger.types';

export function toECSFields(
  context: string,
  meta?: LogMeta,
  trace?: string,
): Record<string, unknown> {
  const ecsData: Record<string, unknown> = {
    log: { logger: context },
  };

  if (meta?.userId) ecsData.user = { id: meta.userId };
  if (meta?.action) ecsData.event = { action: meta.action };
  if (meta?.details) ecsData.labels = { ...meta.details };

  const reserved = ['userId', 'action', 'details'];
  const extras = Object.entries(meta || {})
    .filter(([k]) => !reserved.includes(k))
    .reduce((acc, [k, v]) => ({ ...acc, [k]: v }), {});

  if (Object.keys(extras).length > 0) {
    ecsData.labels = {
      ...((ecsData.labels as Record<string, unknown>) || {}),
      ...extras,
    };
  }

  if (trace) ecsData.error = { stack_trace: trace };

  return ecsData;
}
