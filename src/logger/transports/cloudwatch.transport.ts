import * as WinstonCloudWatch from 'winston-cloudwatch';

export const cloudWatchTransport = new WinstonCloudWatch({
  logGroupName: 'AppLogs',
  logStreamName: 'UserModuleLogs',
  awsRegion: 'us-east-1',
  jsonMessage: true,
});
