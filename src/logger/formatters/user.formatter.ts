import { format } from 'winston';

interface UserLogMeta {
  userId?: string;
  action?: string;
  details?: Record<string, unknown>;
}

export const userFormatter = format.combine(
  format((info) => {
    const meta = info.meta as UserLogMeta | undefined;
    info.timestamp = new Date().toISOString();
    info.user = meta?.userId;
    info.action = meta?.action;
    info.details = meta?.details ?? {};
    return info;
  })(),
  format.printf((info) => {
    const timestamp = String(info.timestamp);
    const level = String(info.level);
    const message = String(info.message);
    const user =
      info.user == null
        ? 'N/A'
        : typeof info.user === 'string'
          ? info.user
          : JSON.stringify(info.user);

    const action =
      info.action == null
        ? 'N/A'
        : typeof info.action === 'string'
          ? info.action
          : JSON.stringify(info.action);
    const details = info.details;

    const detailsString =
      details && Object.keys(details).length > 0
        ? ` | details=${JSON.stringify(details)}`
        : '';

    return `${timestamp} [${level}] user=${user} action=${action} message="${message}"${detailsString}`;
  }),
);
