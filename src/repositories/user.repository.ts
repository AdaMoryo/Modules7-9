import RedisSingleton from '../redis';
import { User } from '../types/user';

const redis = RedisSingleton.instance.redis;

export const userRepository = {
  async save(user: User): Promise<void> {
    const { id, ...fields } = user;
    await redis.hset(`user:${id}`, fields as any); // Redis accepts Record<string, string>
    await redis.sadd('users', id);
  },

  async findById(id: string): Promise<User | null> {
    const user = await redis.hgetall(`user:${id}`);
    if (Object.keys(user).length === 0) return null;

    return {
      id,
      email: user.email,
      username: user.username,
      password: user.password,
      role: user.role as User['role'],
      classification: parseInt(user.classification) as User['classification'],
    };
  },

  async findAll(): Promise<User[]> {
    const ids = await redis.smembers('users');
    return Promise.all(ids.map(async id => {
      const user = await redis.hgetall(`user:${id}`);
      return {
        id,
        email: user.email,
        username: user.username,
        password: user.password,
        role: user.role as User['role'],
        classification: parseInt(user.classification) as User['classification'],
      };
    }));
  },
};
