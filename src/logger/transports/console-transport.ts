import * as winston from 'winston';

export const consoleTransport = new winston.transports.Console({
  format: winston.format.simple(),
});
