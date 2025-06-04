import RedisSingleton from '../redis';

const redis = RedisSingleton.instance.redis;

export const userRepository = {
  async save(user: { id: string; name: string; email: string }) {
    await redis.hset(`user:${user.id}`, {
      name: user.name,
      email: user.email,
    });
    await redis.sadd('users', user.id);
  },

  async findById(id: string) {
    const user = await redis.hgetall(`user:${id}`);
    return Object.keys(user).length === 0 ? null : { id, ...user };
  },

  async findAll() {
    const ids = await redis.smembers('users');
    return Promise.all(ids.map(async id => {
      const user = await redis.hgetall(`user:${id}`);
      return { id, ...user };
    }));
  },
};
