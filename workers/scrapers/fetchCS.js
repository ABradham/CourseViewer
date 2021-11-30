/*
* author: abradham
* title: fetchCS.js
* purpose: Fetches data about Dartmouth's CS classes from the registrar's
           timetable website. HTTP Header wierdness and HTML parsing ahead,
           you've been warned.
* https://stackoverflow.com/questions/38533580/nodejs-how-to-promisify-http-request-reject-got-called-two-times/38543075
*/

// Imports
const xhrReqs = require("../networkUtils/xhrReqs");
const cheerio = require("cheerio");
const redisClient = require("../networkUtils/redisClient");

const CSClassKey = "CSCourses";

const CRN_INDEX = 1;
const CLASS_NUM_INDEX = 3;
const SECTION_INDEX = 4;
const CLASS_NAME_INDEX = 5;
const PROF_INDEX = 12;
const ENRL_LIMIT_INDEX = 15;
const ENRL_CURRENT_INDEX = 16;

// Functions
function createObjectFromHTML(columns, $) {
  return {
    class_name: $(columns[CLASS_NAME_INDEX]).text(),
    prof_name: $(columns[PROF_INDEX]).text(),
    enrl_limit: isNaN(parseInt($(columns[ENRL_LIMIT_INDEX]).text(), 10))
      ? Infinity
      : parseInt($(columns[ENRL_LIMIT_INDEX]).text(), 10),
    enrl_current: parseInt($(columns[ENRL_CURRENT_INDEX]).text(), 10),
  };
}

async function saveToRedis(keyName, classObjList) {
  await redisClient.saveObjList(keyName, classObjList);
}

// Main Function
async function fetchCS() {
  var allCourseObjects = [];
  // HTTP POST request
  console.log("[fetchCS]: Started Function");
  const htmlData = await xhrReqs.postFormData();
  if (htmlData == null) {
    console.log("[fetchCS]: Couldn't load HTML from page; Ending script.");
    return;
  }

  // Scraping data from HTML
  const $ = cheerio.load(htmlData);
  const allTableRows = $(".data-table > table > tbody > tr").toArray();
  allTableRows.forEach((row) => {
    // Exclude first row because it holds table headers and no real data
    if (row !== allTableRows[0]) {
      const current_row_columns = $(row).find("td").toArray();
      const current_course = createObjectFromHTML(current_row_columns, $);
      console.log(current_course);
      allCourseObjects.push(current_course);
    }
  });

  console.log("[fetchCS]: Finished converting tables to objects");
  console.log(`[fetchCS]: Collected ${allCourseObjects.length} courses`);

  await saveToRedis(CSClassKey, allCourseObjects);
  console.log("[fetchCS]: Saved course data to redis store");
}

fetchCS();

module.exports = fetchCS;
