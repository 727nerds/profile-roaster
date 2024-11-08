import { createStorage } from "unstorage";
import fsDriver from "unstorage/drivers/fs";
import redisDriver from "unstorage/drivers/redis";

export const kv = createStorage({
  driver: process.env.NODE_ENV === 'development' ? fsDriver({ base: "./kv" }) : redisDriver({
    host: process.env.REDIS_HOST,
    port: parseInt(process.env.REDIS_PORT!),
    password: process.env.REDIS_PASSWORD,
  }),
});
