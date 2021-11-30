const redisClient = require("../networkUtils/redisClient");

async function textUsers() {
  // Get all user objects from redis store
  var allUsers = await redisClient.getObjList("AllUsers");
  if (allUsers == null) {
    console.log("[messenger]: No users found, exiting script");
    return;
  }

  // Get all classes from redis store
  var allClasses = await redisClient.getObjList("CSCourses");
  if (allClasses == null) {
    console.log("[messenger]: No classes found, exiting script");
    return;
  }

  // Loop through every registered user and get classes w/ open seats
  // // Send message to user about each open class
  allUsers.forEach((currentUser) => {
    const currentUserCourses = currentUser.courseNumbers;
    currentUserCourses.forEach((course) => {
      console.log(`${currentUser.name} is trying to get into ${course}`);
    });
  });
}

textUsers();
module.exports = textUsers;
