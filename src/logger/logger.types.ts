/* eslint-disable prettier/prettier */
export interface LogMeta {
  userId?: number;
  action?: string;
  details?: Record<string, unknown>;
  [key: string]: unknown;
}

export const DEFAULT_TRANSPORT = 'console' as const;

export type TransportType = 'console' | 'elastic' | 'cloudwatch';
export type LoggerContext = string;
