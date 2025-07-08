/* eslint-disable prettier/prettier */
import { Injectable, Scope } from '@nestjs/common';
import { createLogger, Logger as WinstonLogger } from 'winston';
import { ecsFormatter } from './logger.formatter';
import { LoggerConfig } from './logger.config';
import { transportMap } from './logger.transports';
import type Transport from 'winston-transport';
import type { LogMeta, LoggerContext, TransportType } from './logger.types';

export const DEFAULT_TRANSPORT: TransportType = 'console';

@Injectable({ scope: Scope.TRANSIENT })
export class AppLogger {
  private loggers: Map<string, WinstonLogger> = new Map();

  private buildLogger(transport: TransportType): WinstonLogger {
    const config = LoggerConfig[transport] || LoggerConfig[DEFAULT_TRANSPORT];

    const transports: Transport[] = config.transports
      .map((name) => transportMap[name as TransportType])
      .filter(Boolean);

    return createLogger({
      level: config.level || 'info',
      format: ecsFormatter,
      transports,
    });
  }

  private getLogger(context: LoggerContext, transport: TransportType): WinstonLogger {
    const key = `${context}:${transport}`;
    if (!this.loggers.has(key)) {
      this.loggers.set(key, this.buildLogger(transport));
    }
    return this.loggers.get(key)!;
  }

  private toECSFields(
    context: LoggerContext,
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
      .filter(([key]) => !reserved.includes(key))
      .reduce<Record<string, unknown>>((acc, [key, value]) => {
        acc[key] = value;
        return acc;
      }, {});

    if (Object.keys(extras).length > 0) {
      ecsData.labels = {
        ...((ecsData.labels as Record<string, unknown>) || {}),
        ...extras,
      };
    }

    if (trace) ecsData.error = { stack_trace: trace };

    return ecsData;
  }

  public buildLogObject(
    level: 'info' | 'warn' | 'error',
    message: string,
    context: LoggerContext = 'Default',
    meta?: LogMeta,
    trace?: string,
  ): Record<string, unknown> {
    const logger = this.getLogger(context, 'console');
    const logEntry = logger.format.transform(
      {
        level,
        message,
        ...this.toECSFields(context, meta, trace),
      },
      { all: true },
    );
    return logEntry as Record<string, unknown>;
  }

  log(
    message: string,
    context: LoggerContext = 'Default',
    meta?: LogMeta,
    transport: TransportType = DEFAULT_TRANSPORT,
  ): void {
    this.getLogger(context, transport).info(message, this.toECSFields(context, meta));
  }

  error(
    message: string,
    context: LoggerContext = 'Default',
    traceOrMeta?: string | LogMeta,
    transport: TransportType = DEFAULT_TRANSPORT,
  ): void {
    const trace = typeof traceOrMeta === 'string' ? traceOrMeta : undefined;
    const meta = typeof traceOrMeta === 'object' && traceOrMeta !== null ? traceOrMeta : undefined;
    this.getLogger(context, transport).error(message, this.toECSFields(context, meta, trace));
  }

  warn(
    message: string,
    context: LoggerContext = 'Default',
    meta?: LogMeta,
    transport: TransportType = DEFAULT_TRANSPORT,
  ): void {
    this.getLogger(context, transport).warn(message, this.toECSFields(context, meta));
  }
}
