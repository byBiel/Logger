/* eslint-disable prettier/prettier */
export type TransportType = 'console' | 'elastic' | 'cloudwatch';
export type FormatterType = 'ecs';
export type LogLevel = 'info' | 'warn' | 'error' | 'debug';

export interface LoggerModuleConfig {
  level: LogLevel;
  transports: TransportType[];
  formatter: FormatterType;
}

export const LoggerConfig: Record<TransportType, LoggerModuleConfig> = {
  console: {
    level: 'info',
    transports: ['console'],
    formatter: 'ecs',
  },
  cloudwatch: {
    level: 'info',
    transports: ['cloudwatch', 'console'],
    formatter: 'ecs',
  },
  elastic: {
    level: 'info',
    transports: ['elastic', 'console'],
    formatter: 'ecs',
  },
};
