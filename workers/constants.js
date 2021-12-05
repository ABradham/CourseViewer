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

// FetchCS POST request https options
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

// Exported values
module.exports.CS_FORM_DATA = formdata;
module.exports.CS_POST_OPTIONS = options;
