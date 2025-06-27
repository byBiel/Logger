import { Injectable, Scope } from '@nestjs/common';
import { createLogger, Logger as WinstonLogger } from 'winston';
import { LoggerConfig } from './logger.config';
import { consoleTransport } from './transports/console.transport';
import { elasticTransport } from './transports/elastic.transport';
import { cloudWatchTransport } from './transports/cloudwatch.transport';
import { defaultFormatter } from './formatters/default.formatter';
import { userFormatter } from './formatters/user.formatter';
import { Format } from 'logform';
import type Transport from 'winston-transport';

const transportMap: Record<string, Transport> = {
  console: consoleTransport,
  elastic: elasticTransport,
  cloudwatch: cloudWatchTransport,
};

const formatterMap: Record<string, Format> = {
  default: defaultFormatter,
  user: userFormatter,
};

@Injectable({ scope: Scope.TRANSIENT })
export class AppLogger {
  private logger: WinstonLogger;
  private lastContext: string | undefined;

  constructor() {}

  private buildLogger(context: string): WinstonLogger {
    const config = LoggerConfig[context] || LoggerConfig['Default'];

    const activeTransports: Transport[] = config.transports.map(
      (name) => transportMap[name],
    );
    const formatter: Format = formatterMap[config.formatter];

    return createLogger({
      level: 'info',
      format: formatter,
      transports: activeTransports,
    });
  }

  private getLogger(context: string): WinstonLogger {
    if (!this.logger || this.lastContext !== context) {
      this.logger = this.buildLogger(context);
      this.lastContext = context;
    }
    return this.logger;
  }

  log(message: string, context = 'Default', meta?: Record<string, any>) {
    this.getLogger(context).info(message, { context, meta });
  }

  error(message: string, context = 'Default', trace?: string) {
    this.getLogger(context).error(message, { context, trace });
  }

  warn(message: string, context = 'Default') {
    this.getLogger(context).warn(message, { context });
  }
}
