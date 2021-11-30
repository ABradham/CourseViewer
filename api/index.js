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
    potentialUser.courseNumbers.length > 0
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

    try {
      // Try to add new user to database
      await addUserToDB(newlyCreatedUser);
      // Allow endpoint access from client
      res.send({ success: true });
    } catch (e) {
      // Send failure response if something goes wrong
      console.log("Error adding user to database");
      console.log(e);
      res.send({ success: false });
    }
  } else {
    // Send failure response if client JSON is incorrectly structured
    res.send({ success: false });
  }
});

// Start server listening
app.listen(port, "localhost", () => {
  console.log(`Server Listening on port ${port}`);
});
