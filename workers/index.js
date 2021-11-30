var CronJob = require("cron").CronJob;
const fetchCS = require("./scrapers/fetchCS");

var csScraper = new CronJob(
  "*,5,10,15,20,25,30,35,40,45,50,55 * * * *",
  fetchCS,
  null,
  true,
  "America/Los_Angeles"
);

//Start csScraper
csScraper.start();
