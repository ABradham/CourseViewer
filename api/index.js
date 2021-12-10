const express = require("express");
const redisClient = require("../workers/networkUtils/redisClient");
const cors = require("cors");

const app = express();
const port = 3001;

// Use express json body parser middleware
app.use(express.json());

// Use cors
app.use(cors());

// ------Functions------
async function addUserToDB(newUser) {
  // Pull current users in DB and add new user to list
  var currentUsers = await redisClient.getObjList("AllUsers");
  if (currentUsers == null) {
    currentUsers = [];
  }
  currentUsers = [...currentUsers, newUser];

  // Set modified list into DB
  await redisClient.saveObjList("AllUsers", currentUsers);
}

function hasAllUserCharacteristics(potentialUser) {
  return (
    potentialUser.name &&
    potentialUser.phoneNum &&
    potentialUser.courseNumbers != null
  );
}

// ------Routes------
app.get("/", (req, res) => {
  // Allow endpoint access from client
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");

  res.send("Hello world!");
});

app.post("/createUser", async (req, res) => {
  // Check if clinet JSON has all fields for new user
  if (hasAllUserCharacteristics(req.body)) {
    var newlyCreatedUser = {
      name: req.body.name,
      phoneNum: req.body.phoneNum,
      courseNumbers: req.body.courseNumbers,
    };

    // Check if a user with the same phone number is already registered
    try {
      //TODO: reuse this list when adding new user in the addUserToDB() function
      var allUsers = await redisClient.getObjList("AllUsers");
      if (allUsers.some((user) => user.phoneNum == newlyCreatedUser.phoneNum)) {
        res.send({ succes: false, reason: "Same phone already registered" });
        console.log("[/createUser]: Refused to create new user. Same phone #");
        return;
      }
    } catch (e) {
      console.log("[/createUser]: Couldn't load users from redis store.");
      res.send({ succes: false });
    }

    try {
      // Try to add new user to database
      await addUserToDB(newlyCreatedUser);
      // Allow endpoint access from client
      res.send({ success: true });
      console.log("[/createUser]: Successfully added a new user");
    } catch (e) {
      // Send failure response if something goes wrong
      console.log("[/createUsers]: Error adding user to database");
      console.log(e);
      res.send({ success: false });
    }
  } else {
    // Send failure response if client JSON is incorrectly structured
    res.send({ success: false });
    console.log("[/createUser]: Recieved request without correct body params");
  }
});

// Start server listening
app.listen(port, "localhost", () => {
  console.log(`Server Listening on port ${port}`);
});
