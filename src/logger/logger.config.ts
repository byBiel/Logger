export interface LoggerModuleConfig {
  transports: string[];
  formatter: string;
}

export const LoggerConfig: Record<string, LoggerModuleConfig> = {
  UserModule: {
    transports: ['console', 'elastic'],
    formatter: 'user',
  },
  Default: {
    transports: ['console'],
    formatter: 'default',
  },
};
