function sendCarsonEmail(e) {
  var costCenters = {
    "PDX-Equipment": 10,
    "PDX-Construction": 11,
    "PDX-Operations Overhead": 17,
    "SEA-Operations Overhead": 27,
    "SEA-Equipment": 31,
    "SEA-Construction": 32,
    "PDX-Administration": 20,
    "SEA-Administration": 20
  };

  // Get Carson Cost Center ID (ccid) from location/department
  var ccid = costCenters[`${e.location}-${e.department}`] || "";

  GmailApp.sendEmail("InsideSales@carsonteam.com, thomas.spisla@carsonteam.com", "NWFEM Employee Update", "", {
    htmlBody: `<div dir="ltr"><p style="color: #ee6425">This is an automated email from Northwest Facilities and Equipment Maintenance, LLC.</p><p>Hello,<br>We need a gas PIN for the following employee:</p><div dir="ltr"><span style="color:rgb(0,0,0)"><table cellspacing="0" cellpadding="0" dir="ltr" border="1" style="table-layout:fixed;font-size:10pt;font-family:Arial;width:0px;border-collapse:collapse;border:medium"><colgroup><col width="45"><col width="140"><col width="43"><col width="53"><col width="131"><col width="131"><col width="85"><col width="132"></colgroup><tbody><tr style="height:21px"><td style="border:1px solid rgb(204,204,204);overflow:hidden;padding:2px 3px;vertical-align:bottom;background-color:rgb(164,194,244)">Dept #</td><td style="border:1px solid rgb(204,204,204);overflow:hidden;padding:2px 3px;vertical-align:bottom;background-color:rgb(164,194,244)">Driver Name</td><td style="border:1px solid rgb(204,204,204);overflow:hidden;padding:2px 3px;vertical-align:bottom;background-color:rgb(164,194,244)">Pin#</td><td style="border:1px solid rgb(204,204,204);overflow:hidden;padding:2px 3px;vertical-align:bottom;background-color:rgb(164,194,244)">Division</td><td style="border:1px solid rgb(204,204,204);overflow:hidden;padding:2px 3px;vertical-align:bottom;background-color:rgb(164,194,244)">Department</td><td style="border:1px solid rgb(204,204,204);overflow:hidden;padding:2px 3px;vertical-align:bottom;background-color:rgb(164,194,244)">Days of Week to Fuel</td><td style="border:1px solid rgb(204,204,204);overflow:hidden;padding:2px 3px;vertical-align:bottom;background-color:rgb(164,194,244)">Hours to Fuel</td><td style="border:1px solid rgb(204,204,204);overflow:hidden;padding:2px 3px;vertical-align:bottom;background-color:rgb(164,194,244)">Transactions Per Day </td></tr><tr style="height:21px"><td style="border:1px solid rgb(204,204,204);overflow:hidden;padding:2px 3px;vertical-align:bottom;text-align:right">${ccid}</td><td style="border:1px solid rgb(204,204,204);overflow:hidden;padding:2px 3px;vertical-align:bottom">${ccid}${e.lastName},${e.firstName}</td><td style="border:1px solid rgb(204,204,204);overflow:hidden;padding:2px 3px;vertical-align:bottom;text-align:right"></td><td style="border:1px solid rgb(204,204,204);overflow:hidden;padding:2px 3px;vertical-align:bottom">${e.location}</td><td style="border:1px solid rgb(204,204,204);overflow:hidden;padding:2px 3px;vertical-align:bottom">${e.department}</td><td style="border:1px solid rgb(204,204,204);overflow:hidden;padding:2px 3px;vertical-align:bottom">All</td><td style="border:1px solid rgb(204,204,204);overflow:hidden;padding:2px 3px;vertical-align:bottom">All </td><td style="border:1px solid rgb(204,204,204);overflow:hidden;padding:2px 3px;vertical-align:bottom;text-align:right">3</td></tr></tbody></table></span></div><p>Please reply to this email with the PIN. If you have any questions or concerns, do not hesitate to contact us.</p><p>Thank you,<br>NWFEM Team</p></div>`,
    name: "NWFEM IT"
  });

  Logger.log(`${e.workEmail}:\tSent Carson email`);
}