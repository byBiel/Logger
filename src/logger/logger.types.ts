export interface LogMeta {
  userId?: string;
  action?: string;
  details?: Record<string, unknown>;
  [key: string]: unknown;
}

export const DEFAULT_TRANSPORT = 'console' as const;

export type TransportType = 'console' | 'elastic' | 'cloudwatch';
export type LoggerContext = string;
