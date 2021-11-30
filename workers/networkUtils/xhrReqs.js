/* notes: This thread (https://github.com/axios/axios/issues/789) saved my
         ENTIRE LIFE when I found it. The POST wouldn't work otherwise
         and I was *this* close to downloading wireshark to diagnose what was
         going on.
*/

// Document imports
const https = require("https");
const FormData = require("form-data");

// FormData for POST request
var formdata = new FormData();
formdata.append("distribradio", "alldistribs");
formdata.append("depts", "no_value");
formdata.append("periods", "no_value");
formdata.append("distribs", "no_value");
formdata.append("distribs_i", "no_value");
formdata.append("distribs_wc", "no_value");
formdata.append("deliverymodes", "no_value");
formdata.append("pmode", "public");
formdata.append("term", "");
formdata.append("levl", "");
formdata.append("fys", "n");
formdata.append("wrt", "n");
formdata.append("pe", "n");
formdata.append("review", "n");
formdata.append("crnl", "no_value");
formdata.append("classyear", "2008");
formdata.append("searchtype", "Subject Areas");
formdata.append("termradio", "selectterms");
formdata.append("terms", "no_value");
formdata.append("terms", "202201");
formdata.append("deliveryradio", "selectdelivery");
formdata.append("subjectradio", "selectsubjects");
formdata.append("depts", "COSC");
formdata.append("hoursradio", "allhours");
formdata.append("sortorder", "dept");

// Request Options
const options = {
  hostname: "oracle-www.dartmouth.edu",
  port: 443,
  path: "/dart/groucho/timetable.display_courses",
  method: "POST",
  headers: {
    ...formdata.getHeaders(),
    "Content-Length": formdata.getLengthSync(),
  },
};

function timetablePostRequest() {
  return new Promise(function (resolve, reject) {
    var req = https.request(options, (res) => {
      var body = [];

      //Log status code
      //console.log(`Status code: ${res.statusCode}`);

      // Concatenate Data as it's recieved
      res.on("data", (d) => {
        const htmlString = d.toString("utf-8");
        body.push(htmlString);
      });

      // Resolve promist once all data is recieved
      res.on("end", () => {
        var finalHTML = "";
        try {
          finalHTML = body.join("");
        } catch (error) {
          https.globalAgent.destroy();
          reject(error);
        }
        https.globalAgent.destroy();
        resolve(finalHTML);
      });
    });

    // Write form data buffer into POST request
    req.write(formdata.getBuffer());

    // Reject promise on error
    req.on("error", (error) => {
      reject(error);
      https.globalAgent.destroy();
    });

    // End request [IMPORTANT]
    req.end();
  });
}

async function postFormData() {
  const text = await timetablePostRequest();
  return text;
}

module.exports.postFormData = postFormData;
