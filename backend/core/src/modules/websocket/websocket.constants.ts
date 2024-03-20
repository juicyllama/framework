export const REDIS_PUB_CLIENT = 'REDIS_PUB_CLIENT'
export const REDIS_SUB_CLIENT = 'REDIS_SUB_CLIENT'
export const WEBSOCKETS_REDIS_CHANNEL = 'websockets'
export type WebsocketRedisEvent = { event: string; data: any; userId?: number }
