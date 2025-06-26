import { Injectable } from '@nestjs/common';
import * as winston from 'winston';
import { LoggerConfig } from './logger-config';
import { elasticTransport } from './transports/elastic-transport';
import { cloudWatchTransport } from './transports/cloudwatch-transport';
import { consoleTransport } from './transports/console-transport';
import { userFormatter } from './formatters/user-formatter';
import { defaultFormatter } from './formatters/default-formatter';

const formatterMap = {
  user: userFormatter,
  default: defaultFormatter,
};

const transportMap = {
  elastic: elasticTransport,
  cloudwatch: cloudWatchTransport,
  console: consoleTransport,
};

@Injectable()
export class AppLogger {
  private loggers: Record<string, winston.Logger> = {};

  constructor() {
    for (const moduleName in LoggerConfig.modules) {
      const moduleConfig = LoggerConfig.modules[moduleName];
      const transports = moduleConfig.destinations.map(dest => transportMap[dest]);

      this.loggers[moduleName] = winston.createLogger({
        level: 'info',
        format: winston.format.json(),
        transports,
      });
    }
  }

  log(
    module: string,
    level: 'info' | 'error' | 'warn' | 'debug' | 'verbose',
    message: string,
    meta: Record<string, any> = {},
  ) {
    const moduleConfig = LoggerConfig.modules[module] ?? LoggerConfig.modules['default'];
    const formatterFn = formatterMap[moduleConfig.formatter] ?? formatterMap.default;
    const logPayload = formatterFn(level, message, meta);

    const logger = this.loggers[module];
    if (logger) {
      logger.log(level, logPayload.message, { meta: logPayload });
    } else {
      console.warn(`[Logger] Módulo desconhecido: ${module}`);
    }
  }
}
