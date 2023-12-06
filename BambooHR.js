function callBambooHR(endpoint, method, payload, errorHandler) {
  const options = {
    method: method,
    headers: {
      'Authorization': 'Basic ' + Utilities.base64Encode(sp.getProperty('API_KEY') + ":x"),
      'Content-Type': 'application/json'
    },
    payload: payload ? JSON.stringify(payload) : null
  };

  try {
    return UrlFetchApp.fetch('https://api.bamboohr.com/api/gateway.php/nwfem/v1/' + endpoint, options);
  } catch (error) {
    errorHandler(error);
    return null;
  }
}

// Get info for all past, current, and future (if already hired) employees from BambooHR.
function getBHREmployees() {
  Logger.log("System:\tDownloading employee data from BambooHR");

  // BambooHR Employee fields to download in report
  var payload = {
    "title": "Past/Current/Future Employee Info",
    "fields": ["department", "displayName", "employeeNumber", "firstName", "hireDate", "homeEmail", "homePhone", "id", "isPhotoUploaded", "jobTitle", "lastName", "location", "mobilePhone", "preferredName", "status", "supervisorEmail", "workEmail", "workPhone", "workPhoneExtension"]
  };

  const response = callBambooHR('reports/custom?format=JSON&onlyCurrent=false', 'POST', payload, error => {
    Logger.log("Error:\tUnable to download BambooHR employee report");
    throw error;
  });

  return JSON.parse(response.getContentText()).employees;
}

function getPhotoData(e) {
  Logger.log(e.workEmail + ":\tSearching for BambooHR profile photo.");

  // Get photo data from BambooHR API
  return callBambooHR(`employees/${e.id}/photo/large`, 'GET', null, error => {
    if (error != "Exception: Request failed for https://api.bamboohr.com returned code 404") {
      Logger.log(`Error:\t${error}`);
      throw error;
    }
  });
}
