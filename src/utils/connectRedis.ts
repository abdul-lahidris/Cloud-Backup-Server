require('dotenv').config();
import { createClient } from 'redis';


import config from 'config';

const redisConfig = config.get<{
  redisUrl: string;
}>('redis');

const redisUrl = redisConfig.redisUrl;

const redisClient = createClient({
  url: redisUrl,
});

const connectRedis = async () => {
  try {
    await redisClient.connect();
    console.log('Redis client connect successfully');
    redisClient.set('try', 'Hello Welcome to Express with TypeORM');
  } catch (error) {
    console.log(error);
    setTimeout(connectRedis, 5000);
    // process.exit();
  }
};

connectRedis();

export default redisClient;
