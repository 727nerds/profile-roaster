import { createStorage } from "unstorage";
import fsDriver from "unstorage/drivers/fs";

export const kv = createStorage({
  driver: fsDriver({ base: "./kv" }),
});
