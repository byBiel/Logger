import ecsFormat from '@elastic/ecs-winston-format';

export const ecsFormatter = ecsFormat({ convertReqRes: true });
