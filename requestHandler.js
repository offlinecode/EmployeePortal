/**
 * New node file
 */

var mysql = require('mysql');
var nodemailer = require('nodemailer');

function createDBConn() {
	var connection = mysql.createConnection({
		host : 'localhost',
		user : 'root',
		password : 'root',
		database : 'EmployeePortal'
	});
	return connection;
}

function getADPReport(req, res) {
	var body = '<html>' + '<head>' + '<meta http-equiv="Content-Type" '
			+ 'content="text/html; charset=UTF-8" />' + '</head>' + '<body>'
			+ '<form action="/upload" enctype="multipart/form-data" '
			+ 'method="post">' + '<input type="file" name="upload">'
			+ '<input type="submit" value="Upload file" />' + '</form>'
			+ '</body>' + '</html>';
	res.writeHead(200, {
		"Content-Type" : "text/html"
	});
	res.write(body);
	res.end();

}

function genenerateEmployeeID(req, res) {
	var connection = createDBConn();
	connection.connect();
	var query = connection.query('CALL `EmployeePortal`.`GetEmployeeID`();');

	query.on('error', function(err) {
		connection.end();
		throw err;
	});

	query.on('fields', function(fields) {
		// console.log(fields);
	});

	query.on('result', function(rows) {

		for ( var i in rows) {
			if (i === 'empID') {

				res.writeHead(200, {
					"Content-Type" : "text/plain"
				});
				res.write(JSON.stringify(rows[i]));
				res.end();
				connection.end();
			}
		}

	});

}

function registerEmployee(req, res) {
	var fullBody = "";
	req.on('data', function(chunk) {
		// append the current chunk of data to the fullBody variable
		fullBody += chunk.toString();
		var jsonBody = JSON.parse(fullBody);
		var connection = createDBConn();
		connection.connect();

		var query = connection.query(
				'CALL `EmployeePortal`.`AddNewEmployee`(?, ?, ?, ?, ?, ?, ?);', [
						jsonBody.EmpFName, jsonBody.EmpLName, jsonBody.EmpHR,
						jsonBody.EmpOR,jsonBody.EmpEmail,jsonBody.EmpPhone ,jsonBody.EmpUUID ]);
		
		var transporter = nodemailer.createTransport({
		    service: 'gmail',
		    auth: {
		        user: 'r.shenoyravindra@gmail.com',
		        pass: '#Startrek_1'
		    }
		});
		transporter.sendMail({
		    from: 'r.shenoyravindra@gmail.com',
		    to: 'r.shenoyravindra@gmail.com',
		    subject: 'Welcome to DaysInn',
		    text: 'Hello, Your UserID has successfully been created. You can now start using your smart card to login.'
		});
		res.writeHead(200, {
			"Content-Type" : "text/plain"
		});

		res.end();
	});
}

function getEmployeeRpt(req, res) {
	var connection = createDBConn();
	connection.connect();
	var fullBody = "";
	req.on('data', function(chunk) {
		// append the current chunk of data to the fullBody
		// variable
		fullBody += chunk.toString();
		var jsonBody = JSON.parse(fullBody);
		var connection = createDBConn();
		connection.connect();

		var query = connection.query(
				'CALL `EmployeePortal`.`GetReportByEmpID`(?,?,?);', [
						jsonBody.fromDt, jsonBody.toDt, jsonBody.empID ],
				function(err, result) {
					var xmlReport = '';
					var report = result[0];
					var xmlBody = '';
					for ( var index in report) {

						xmlBody = xmlBody + '<TimeStamp date="'
								+ report[index].currentDate + '" day="'
								+ report[index].currentDay + '" checkin="'
								+ report[index].loginTime + '" checkout="'
								+ report[index].logoutTime + '" net="'
								+ report[index].NetHours + '" Name="'
								+ report[index].empName + '" Rate="'
								+ report[index].empRate + '" ID="'
								+ report[index].empID + '"/>';
					}
					xmlBody = '<EmployeeReport startDt="'+jsonBody.fromDt+'" endDt="'+jsonBody.toDt+'">' + xmlBody
							+ '</EmployeeReport>';
					console.log(xmlBody);
					res.writeHead(200, {
						"Content-Type" : "text/xml"
					});
					res.write(xmlBody);
					res.end();
					connection.end();

				});

	});

}

function getTimeSheet(req, res) {
	var connection = createDBConn();
	connection.connect();
	var fullBody = "";
	req.on('data', function(chunk) {
		// append the current chunk of data to the fullBody
		// variable
		fullBody += chunk.toString();
		var jsonBody = JSON.parse(fullBody);
		var connection = createDBConn();
		connection.connect();

		var query = connection.query(
				'CALL `EmployeePortal`.`GetADPReport`(?,?);', [
						jsonBody.fromDt, jsonBody.toDt ],
				function(err, result) {
					var xmlReport = '';
					var report = result[0];
					var xmlBody = '';
					for ( var index in report) {
						xmlBody = xmlBody + '<TimeSheet EmpID="'
								+ report[index].EmployeeID + '" EmpName="'
								+ report[index].EmployeeName
								+ '" HoursWorked="'
								+ report[index].WorkingHours + '" HourlyRate="'
								+ report[index].HourlyWage + '" NetAmount="'
								+ report[index].PaymentOwed + '"/>';

					}
					xmlBody = '<TimeSheetReport startDt="'+jsonBody.fromDt+'" endDt="'+jsonBody.toDt+'">' + xmlBody
							+ '</TimeSheetReport>';
					res.writeHead(200, {
						"Content-Type" : "text/xml"
					});
					res.write(xmlBody);
					res.end();
					connection.end();

				});

	});

}

function getAllEmployeeData(req, res) {
	var connection = createDBConn();
	connection.connect();
	var query = connection.query('SELECT * FROM Employee;', function(err,
			result) {

		res.writeHead(200, {
			"Content-Type" : "text/json"
		});
		res.write(JSON.stringify(result));
		res.end();
		connection.end();
	});

}

function getWeeklyRpt(req, res) {
	var connection = createDBConn();
	connection.connect();

	var fullBody = "";
	req.on('data', function(chunk) {
		// append the current chunk of data to the fullBody
		// variable
		fullBody += chunk.toString();
		var jsonBody = JSON.parse(fullBody);
		var connection = createDBConn();
		connection.connect();
		console.log(fullBody);
		var query = connection.query(
				'CALL `EmployeePortal`.`GetWeeklyReport`(?,?);', [
						jsonBody.fromDt, jsonBody.toDt ],
				function(err, result) {
					console.log(result);
					var xmlReport = '';
					var report = result[0];
					var xmlBody = '';
					for ( var index in report) {
						xmlBody = xmlBody + '<Employee empID="'
								+ report[index].EmployeeID + '" empName="'
								+ report[index].EmployeeName + '" hourlyRate="'
								+ report[index].HourlyRate + '" hours="'
								+ report[index].LoggedHours + '" payment="'
								+ report[index].Payment_Amount + '"/>';

					}
					xmlBody = '<WeeklyRpt startDt="'+jsonBody.fromDt+'" endDt="'+jsonBody.toDt+'">' + xmlBody + '</WeeklyRpt>';
					res.writeHead(200, {
						"Content-Type" : "text/xml"
					});
					console.log(xmlBody);
					res.write(xmlBody);
					res.end();
					connection.end();

				});

	});

}

function emplyeeLoginAction(req, res){
	var connection = createDBConn();
	connection.connect();

	var fullBody = "";
	req.on('data', function(chunk) {
		// append the current chunk of data to the fullBody
		// variable
		fullBody += chunk.toString();
		var jsonBody = JSON.parse(fullBody);
		var connection = createDBConn();
		connection.connect();
		console.log(fullBody);
		var query = connection.query(
				'CALL `EmployeePortal`.`InsertLoginData`(?);', [
						jsonBody.uuid],
				function(err, result) {
					
					
					res.writeHead(200, {
						"Content-Type" : "text/xml"
					});
					
					res.end();
					connection.end();

				});

	});
}

exports.genenerateEmployeeID = genenerateEmployeeID;
exports.registerEmployee = registerEmployee;
exports.getEmployeeRpt = getEmployeeRpt;
exports.getTimeSheet = getTimeSheet;
exports.getAllEmployeeData = getAllEmployeeData;
exports.getWeeklyRpt = getWeeklyRpt;emplyeeLoginAction
exports.emplyeeLoginAction = emplyeeLoginAction;
