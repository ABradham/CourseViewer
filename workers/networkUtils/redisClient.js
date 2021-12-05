const redis = require("redis");

const saveObjList = async (keyName, list) => {
  // Create redis client
  const client = redis.createClient();

  // Check for error
  client.on("error", (err) => {
    throw new Error("[redisClient]: Error connecting to redis");
  });

  // Connect to redis store
  try {
    await client.connect();
    console.log("[redisClient]: Connected to redis store");
  } catch (e) {
    throw new Error("[redisClient]: Error connecting to redis store");
  }

  // Stringify list and save to redis store
  const listAsString = JSON.stringify(list);
  try {
    await client.set(keyName, listAsString);
  } catch (e) {
    throw new Error("[redisClient]: Failed to save keys to redis store");
  }

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
