/* eslint-disable no-console */
import Redis from 'ioredis';

class RedisSingleton {
  static #instance: RedisSingleton;
  public redis: Redis;

  private constructor() {
    this.redis = new Redis({
      host: '127.0.0.1',
      port: 6379,
      lazyConnect: true,
    });

    this.connectToRedis();
    console.log('connected to redis server');
  }

  public static get instance(): RedisSingleton {
    if (!RedisSingleton.#instance) {
      RedisSingleton.#instance = new RedisSingleton();
    }

    return RedisSingleton.#instance;
  }

  //connect & disconnect methods
  connectToRedis = () : void => {
    this.redis.connect();
  };

  disconnectFromRedis = () : void => {
    this.redis.disconnect();
  };

  checkIfRedisConnected = () : boolean => {
    return this.redis.status === 'connecting';
  };

  // DB manipulaion methods
  //set method
  public async set<T>(key: string, value: T, ttlSeconds : number | undefined): Promise<void> {
    ttlSeconds
      ? await this.redis.set(key, JSON.stringify(value), 'EX', ttlSeconds)
      : await this.redis.set(key, JSON.stringify(value));
  };

  // get method
  public async get<T>(key: string): Promise<T | null> {
    const result = await this.redis.get(key);
    return result ? JSON.parse(result) as T : null;
  }

  // del method
  public async del(key: string): Promise<void> {
    await this.redis.del(key);
  }

  //hset method
  public async hset(key: string, entries: Record<string, any>): Promise<void> {
    const serializedEntries: Record<string, string> = {};

    //transforming the entries to a json object
    for (const [field, value] of Object.entries(entries)) {
      serializedEntries[field] = JSON.stringify(value);
    };
    // now applting the json object to the key
    await this.redis.hset(key, serializedEntries);
  };

  //hget method
  public async hget<T>(key: string, field: string): Promise<T | null> {
    const result = await this.redis.hget(key, field);
    return result ? JSON.parse(result) as T : null;
  };

  //hgetall method
  public async hgetall(key: string): Promise<Record<string, any> | null> {
    const result = await this.redis.hgetall(key);
    if (!result || Object.keys(result).length === 0) {
      return null;
    }

    // here we parse the result to use JSON where it can
    const parsedResult: Record<string, any> = {};
    for (const [field, value] of Object.entries(result)) {
      try {
        parsedResult[field] = JSON.parse(value);
      } catch {
        parsedResult[field] = value;
      }
    }

    return parsedResult;
  }

  public async hincrby(key: string, field: string, value : number): Promise<void> {
    await this.redis.hincrby(key, field, value);
  }
}
export default RedisSingleton;
