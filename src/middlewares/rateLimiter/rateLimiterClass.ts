import RedisSingleton from '../../redis';

export class RateLimiter {
  deafaultTokenValue : number;
  windowLength: number;
  redis: RedisSingleton;

  constructor() {
    this.deafaultTokenValue = 3; // 3 requests
    this.windowLength = 60; // per minute
    this.redis = RedisSingleton.instance;
  };

  public getUserRateLimit = async(userId: string, tokenName: string) : Promise<number> => {
    return parseFloat(await this.redis.hget(`rateLimit:${userId}`, tokenName) || '-1');
  };
  public updateUserRateLimit = async(userId: string, tokenName: string, value: number): Promise<void> => {
    await this.redis.hincrby(`rateLimit:${userId}`, tokenName, value);
  };
  public setUserRateLimit = async(userId: string, tokenName: string, value: number, currWindow: number) : Promise<void> => {
    await this.redis.hset(`rateLimit:${userId}:${currWindow}`, { tokenName: value });
    await this,this.redis.redis.expire(`rateLimit:${userId}:${currWindow}`, this.windowLength);
  };
};
