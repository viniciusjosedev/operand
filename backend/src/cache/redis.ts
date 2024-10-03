import Redis from 'ioredis';

export class RedisCache {
  private readonly redisClient = new Redis({
    host: process.env.REDIS_HOST,
    password: process.env.REDIS_PASSWORD,
    port: parseInt(process.env.REDIS_PORT || '6379'),
  });

  async get<T>(key: string): Promise<T | null> {
    const data = await this.redisClient.get(key);
    if (!data) {
      return null;
    }
    return JSON.parse(data);
  }

  async set(key: string, value: any): Promise<void> {
    await this.redisClient.setex(key, 60 * 60 * 24, JSON.stringify(value));
  }

  async delete(key: string): Promise<void> {
    await this.redisClient.del(key);
  }
}
