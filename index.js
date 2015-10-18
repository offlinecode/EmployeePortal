/**
 * New node file
 */

var server = require("./server.js");
var requestHandler = require("./requestHandler.js");
var router = require("./router.js");


var handle = {};
handle["/"] = requestHandler.start;
handle["/getADPReport"] = requestHandler.getADPReport;
handle["/getReportForEmp"] = requestHandler.getReportForEmp;
handle["/genenerateEmployeeID"] = requestHandler.genenerateEmployeeID;
handle["/registerEmployee"] = requestHandler.registerEmployee;
handle["/getEmployeeRpt"] = requestHandler.getEmployeeRpt;
handle["/getTimeSheet"] = requestHandler.getTimeSheet;
handle["/getAllEmployeeData"] = requestHandler.getAllEmployeeData;
handle["/getWeeklyRpt"] = requestHandler.getWeeklyRpt;
handle["/emplyeeLoginAction"] = requestHandler.emplyeeLoginAction;

server.start(router.route, handle);

