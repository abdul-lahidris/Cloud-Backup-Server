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

// const connectRedis = async () => {
//   try {
//     const testStr = redisClient.isOpen;
//     console.log("redis status before try connect: ", testStr);
//     if(!testStr)
//       await redisClient.connect();
//     console.log('Redis client connect successfully');
//     redisClient.set('try', 'Hello Welcome to Idris-s File backup api');
//   } catch (error) {
//     console.log(error);
//     setTimeout(connectRedis, 5000);
//     // process.exit();
//   }
// };
const MAX_RETRIES = 5;
let retryCount = 0;

const connectRedis = async () => {
  try {
    const testStr = redisClient.isOpen;
    console.log("redis status before try connect: ", testStr);
    // if (!testStr)
      await redisClient.connect();
    console.log('Redis client connect successfully');
    redisClient.set('try', 'Hello Welcome to Idris-s File backup api');
  } catch (error) {
    console.log(error);
    if (retryCount < MAX_RETRIES) {
      retryCount++;
      console.log(`Retrying connection, attempt ${retryCount} of ${MAX_RETRIES}`);
      await new Promise(resolve => setTimeout(resolve, 5000));
      await connectRedis(); // Retry the connection
    } else {
      console.log(`Max retry attempts reached (${MAX_RETRIES}), stopping application.`);
      process.exit(1); // Exit the application with an error code
    }
  }
};


connectRedis();

export default redisClient;
