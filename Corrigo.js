// Get Corrigo Enterprise Company Token using API
function getCorrigoToken(clientID, clientSecret) {
  var url = "https://oauth-pro-v2.corrigo.com/OAuth/token";
  var options = {
    'method': 'post',
    'payload': {
      'grant_type': 'client_credentials',
      'client_id': clientID,
      'client_secret': clientSecret
    },
    'contentType': 'application/x-www-form-urlencoded'
  };

  var response = UrlFetchApp.fetch(url, options);
  return JSON.parse(response).access_token;
}

// Get Corrigo Enterprise Company Hostname using API
function getCorrigoHostname(companyName, token) {
  var url = "https://am-apilocator.corrigo.com/api/v1/cmd/GetCompanyWsdkUrlCommand";
  var options = {
    'method': 'post',
    'headers': {
      "CompanyName": companyName,
      "Authorization": "Bearer " + token
    },
    'contentType': "application/json",
    'payload': JSON.stringify({
      "Command": {
        "ApiType": "REST",
        "CompanyName": companyName,
        "Protocol": "HTTPS"
      }
    })
  };

  var response = UrlFetchApp.fetch(url, options);
  return JSON.parse(response.getContentText()).CommandResult.Url;
}

// Create Corrigo user using child functions below
function createCorrigoUser(fName, lName, email, location) {
  var sp = PropertiesService.getScriptProperties();
  var corrigoName = sp.getProperty('CORRIGO_COMPANY_NAME');

  // Get token/company hostname using Corrigo Authentication API
  var token = getCorrigoToken(sp.getProperty('CORRIGO_CLIENT_ID'), sp.getProperty('CORRIGO_CLIENT_SECRET'));
  var hostname = getCorrigoHostname(corrigoName, token);

  // PDX Team ID = 3, SEA Team ID = 4
  var team = location == "PDX" ? 3 : 4;

  // Pass values to postCorrigoUser to create the user using the Corrigo API
  var user = postCorrigoUser(hostname, corrigoName, token, fName, lName, email, 7, team);

  return user ? user.EntitySpecifier.Id : null;
}

// Create new user in Corrigo using Corrigo Enterprise API
function postCorrigoUser(hostname, companyName, token, fName, lName, email, role, team) {
  var url = `${hostname}api/v1/base/Employee`;
  var options = {
    'method': 'post',
    'headers': {
      "CompanyName": companyName,
      "Authorization": `Bearer ${token}`
    },
    'contentType': "application/json",
    'payload': JSON.stringify({
      "Entity": {
        "FirstName": fName,
        "LastName": lName,
        "DisplayAs": fName + " " + lName,
        "Role":{"Id":role},
        "ActorTypeId": "Employee",
        "Username": email,
        "Password": Math.random().toString(36).substring(2,12),
        "Teams": [ {"TeamId": team}]
      }
    })
  };

  try {
    var response = UrlFetchApp.fetch(url, options);
    Logger.log(`${email}:\tCorrigo accout created`);
    return JSON.parse(response.getContentText());
  } catch (error) {
    let err = error.toString();
    if (err.startsWith(`Exception: Request failed for https://am-ce910a.corrigo.com returned code 400. Truncated server response: {"ErrorMessage":"{!{User}!} with {!{User}!} ID '${email}' already exists`)) {
      Logger.log(`${email}: Corrigo account already exists`);
    } else {
      throw new Error(error);
    }
  }
}
