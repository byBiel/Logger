import { format } from 'winston';

export const defaultFormatter = format.combine(
  format.timestamp(),
  format.printf(({ level, message, timestamp, context }) => {
    return `${String(timestamp)} [${String(level)}] [${String(context)}] ${String(message)}`;
  }),
);
