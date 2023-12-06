// BambooHR Employee API domain and key
var sp = PropertiesService.getScriptProperties();

// Gets a list of all past, curent, and future NWFEM employees from a BambooHR report, then updates Google employee info for current employees
function main() {
  var employees = getBHREmployees();

  for (var i = 0; i < employees.length; i++) {
    var e = employees[i];

    switch (hireStatus(e)) {
      case "Terminated":
        console.log(`${e.workEmail}:\tEmployment terminated, skipping employee`);
        break;
      case "Active":
        console.log(`${e.workEmail}:\tActive employee, updating info`);
        updateGoogleUser(e);
        updateGWPhoto(e, getPhotoData(e));
        break;
      case "PreHire":
        console.log(`${e.workEmail}:\tNot yet hired, skipping employee`);
        break;
      case "Onboard":
        console.log(`${e.workEmail}:\tHiring Tommorow, onboarding now`);
        provisionAccounts(e);
        break;
    }
  }
}

function hireStatus(e) {
  // If currently Hired = Active
  if (e.status == "Active")
    return "Active";

  // String containing tomorrows date (ex: 2024-06-23)
  var tomorrow = Utilities.formatDate(new Date(new Date().valueOf() + 86400000), "GMT-7", "yyyy-MM-dd");

  // If Inactive and hire date before tomorrow = Inactive
  // (If hire date is today employee will be active)
  if (e.hireDate < tomorrow)
    return "Terminated";

  // If hiring tomorrow = Onboard
  if (e.hireDate == tomorrow)
    return "Onboard";

  // If hiring in the future = BeforeHireDate
  if (e.hireDate > tomorrow)
    return "PreHire";
}

function provisionAccounts(e) {
  // Create Corrigo user and get userId
  try {
    var userId = createCorrigoUser(e.firstName, e.lastName, e.workEmail, e.location);

    // Log user info to console for debugging
    if (userId)
      Logger.log(`${e.workEmail}:\tCreated Corrigo user:\n\tUser Id: ${userId}\tTeam: ${e.location}`);
  } catch (error) {
    if (error = "TypeError: Cannot read properties of undefined (reading '0')")
      throw new Error(`${e.workEmail}:\tMissing user info`);
  }

  sendCarsonEmail(e);
}

// Given employee data (e), updates the employees Google account data
function updateGoogleUser(e) {
  Logger.log(`${e.workEmail}:\tParsing employee data`);

  // Google Attributes to update
  var attributes = {
    primaryEmail: e.workEmail,
    name: {
      givenName: e.preferredName,
      familyName: e.lastName,
      displayName: e.displayName
    },
    emails: [
      {
        address: e.workEmail,
        primary: true,
        type: "work"
      },
      {
        address: e.homeEmail,
        type: "home"
      }
    ],
    externalIds: [
      {
        customType: "BambooHR",
        type: "custom",
        value: e.id
      }
    ],
    relations: [{
      value: e.supervisorEmail,
      type: "manager"
    }],
    addresses: [],
    organizations: [{
      costCenter: e.location + "-" + e.department,
      title: e.jobTitle,
      department: e.department
    }],
    phones: [],
    locations: [{
      area: e.location,
      buildingId: e.location,
      type: "desk"
    }],
    orgUnitPath: "/" + e.department,
    recoveryEmail: e.homeEmail,
  };

  if (e.employeeNumber)
    attributes.externalIds.push({type: "organization", value: e.employeeNumber});

  if (e.location == "PDX")
    attributes.addresses.push({country: "United States", countryCode: "US", formatted: "11815 NE Sumner St. Portland OR 97220", locality: "Portland", postalCode: "97220", primary: true, region: "OR", streetAddress: "11815 NE Sumner St.",type: "work"});

  if (e.location == "SEA")
    attributes.addresses.push({country: "United States", countryCode: "US", formatted: "6814 South 220th St. Kent WA 98032", locality: "Kent", postalCode: "98032", primary: true, region: "WA", streetAddress: "6814 South 220th St.", type: "work"});

  // If employee has a work phone, add it and make it primary
  // An extension can also be added if nessesary
  if (e.workPhone) {
    attributes.phones.push({
        primary: true,
        type: "work",
        value: e.workPhoneExtension ? e.workPhone + ":" + e.workPhoneExtension : e.workPhone
    });
  }

  if (e.mobilePhone) {
    attributes.phones.push({
        type: "mobile",
        value: e.mobilePhone
    });
    attributes.recoveryPhone = e.mobilePhone;
  }

  if (e.homePhone) {
    attributes.phones.push({
      type: "home",
      value: e.homePhone
    });
  }

  try {
    AdminDirectory.Users.update(attributes, e.workEmail);
    Logger.log(`${e.workEmail}:\tSuccessfully uploaded employee data to Google`)
  } catch (error) {
    Logger.log(`${e.workEmail}:\tUnable to update user`);
    throw error;
  }
}

function updateGWPhoto(e, photo) {
  if (!photo) {
    Logger.log(`${e.workEmail}:\tNo BambooHR profile photo`);
    return;
  }

  AdminDirectory.Users.Photos.update({
    photoData: Utilities.base64Encode(photo.getBlob().getBytes())
  }, e.workEmail);
  Logger.log(`${e.workEmail}:\tUpdated Google profile photo`);
}
