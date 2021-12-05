/* notes: This thread (https://github.com/axios/axios/issues/789) saved my
         ENTIRE LIFE when I found it. The POST wouldn't work otherwise
         and I was *this* close to downloading wireshark to diagnose what was
         going on.
*/

// Document imports
const https = require("https");
const workerConstants = require("../constants");

function timetablePostRequest() {
  return new Promise(function (resolve, reject) {
    var req = https.request(workerConstants.CS_POST_OPTIONS, (res) => {
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
    req.write(workerConstants.CS_FORM_DATA.getBuffer());

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
