const redis = require("redis");

const main = async () => {
  const client = createClient();
  client.on("error", (err) => console.log("Redis Client Error", err));
  await client.connect();

  //await client.set("key", "value");
  const value = await client.get("key");

  console.log(`Got ${value} from database`);
};

const saveObjList = async (keyName, list) => {
  // Create redis client
  const client = redis.createClient();

  // Check for error
  client.on("error", (err) => {
    console.log("[redisClient]: Error connecting to redis");
    return null;
  });

  // Connect to redis store
  await client.connect();

  console.log("[redisClient]: Connected to redis store");
  // Stringify list and save to redis store
  const listAsString = JSON.stringify(list);
  await client.set(keyName, listAsString);

  // Disconnect from redis client
  await client.disconnect();
};

const getObjList = async (keyName) => {
  // Create redis client
  const client = redis.createClient();

  // Check for error
  client.on("error", (err) => {
    console.log(err);
    return null;
  });

  // Connect to redis store
  await client.connect();

  // Get objList from store and Jsonify it
  const objList = await client.get(keyName);

  // Disconnect from redis client
  client.disconnect();

  // Return JSONified objList
  return JSON.parse(objList);
};

module.exports.saveObjList = saveObjList;
module.exports.getObjList = getObjList;
