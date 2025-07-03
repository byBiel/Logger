import { consoleTransport } from './transports/console.transport';
import { elasticTransport } from './transports/elastic.transport';
import { cloudWatchTransport } from './transports/cloudwatch.transport';
import type Transport from 'winston-transport';

export const transportMap: Record<
  'console' | 'elastic' | 'cloudwatch',
  Transport
> = {
  console: consoleTransport,
  elastic: elasticTransport,
  cloudwatch: cloudWatchTransport,
};
