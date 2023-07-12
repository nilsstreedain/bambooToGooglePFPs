// BambooHR Employee API domain and key
var sp = PropertiesService.getScriptProperties();
var employees_api = "https://api.bamboohr.com/api/gateway.php/nwfem/v1/employees/";
var options = {
  headers: {
    'Authorization': 'Basic ' + Utilities.base64Encode(sp.getProperty('API_KEY') + ":x"),
    'Accept': 'application/json'
  }
};

function updatePhotos() {
  // Get BambooHR employee directory
  var response = UrlFetchApp.fetch(employees_api + "directory", options);
  var data = JSON.parse(response.getContentText());
  
  // Loop through all employees
  for (var i = 0; i < data.employees.length; i++) {
    var employee = data.employees[i];           // Get employee record
    var photo = getPhotoData(employee);         // Get employee photo
    if (photo) updateGWPhoto(employee, photo);  // Upload employee photo
  }
}

function getPhotoData(employee) {
  Logger.log(employee.workEmail + ":\tSearching for BambooHR profile photo.");

  // Get photo data from BambooHR API
  try {
    return UrlFetchApp.fetch(employees_api + employee.id + "/photo/large", options);
  } catch (error) {
    if (error == "Exception: Request failed for https://api.bamboohr.com returned code 404")
      Logger.log(employee.workEmail + ":\tNo BambooHR profile photo.");
    else
      Logger.log("Error retrieving photo for " + employee.workEmail + ":\n" + error);
  }
}

function updateGWPhoto(employee, photo) {
  AdminDirectory.Users.Photos.update({
    photoData: Utilities.base64Encode(photo.getBlob().getBytes())
  }, employee.workEmail);
  Logger.log(employee.workEmail + ":\tUpdated profile photo.");
}