//login functionality, start app here
(function() {
	var host = "http://173.255.120.22:1337";
	$(document).ready(function() {
		$("#submit").click(function() {
			submitLogin("/login", false)
		});
		
		$("#registerSubmit").click(function() {
			submitLogin("/register", true);
		});
	});

	function submitLogin(page, newUser) {
		var user = "";
		var pass = "";
		if (newUser) {
			user = $("#usernameRegister").val();
			pass = $("#passwordRegister").val();
		} else {
			user = $("#username").val();
			pass = $("#password").val();
		}
		var obj = {
			"user" : {
				"username" : user,
				"password" : pass
			}
		};
		$.post(host + page, obj, loginResponse);
	}

	function loginResponse(data) {
		$("#login").modal("hide");
		$("#register").modal("hide");
		if (data.success) {
			mainApp(data.user);
		} else {
			alert(data.response);
		}
	}

	function mainApp(user) {
		var userObject = user;
		$(".loggedin").show();
		$(".drinkingButton").click(handleDrinkPress);
		$("#customSubmit").click(handleDrinkCustom);
		$("#graphButton").click(function() {
			getTransactions({}, drawChart);
		});	
		
		google.load('visualization', '1', {'packages':['annotatedtimeline']});
		google.setOnLoadCallback(function() {
			getTransactions({}, drawChart);
		});

		getTotal({}, function(data) {
			console.log(data);
		});

		function handleDrinkPress() {
			var amount = $(this).data('amount');
			sendDrinkTransaction({"amount" : amount}, handleDrinkResponse);
		}

		function handleDrinkCustom() {
			if($("#drinkingField").val()) {
				var amount = $("#drinkingField").val();
				sendDrinkTransaction({"amount" : amount}, handleDrinkResponse);
			}
		}

		function handleDrinkResponse(data) {
			if(data.success) {
				//do something
			} else {
				alert(data.response);
			}
		}

		function sendDrinkTransaction(data, callback) {
			var date = new Date(); 
			var timeStamp = date.getDate() + "/"
                + (date.getMonth()+1)  + "/" 
                + date.getFullYear() + " @ "  
                + date.getHours() + ":"  
                + date.getMinutes() + ":" 
                + date.getSeconds();
			var message = {
				"user" : userObject,
				"transaction" : {
					"datetime" : timeStamp,
					"month" : (date.getMonth()+1),
					"year" : date.getFullYear(),
					"day" : date.getDate(),
					"data" : data
				}
			};
			$.post(host + "/drink", message, callback);
		}

		function getTotal(data, callback) {
			data.user = userObject;
			$.post(host + "/total", data, callback);	
		}

		function getTransactions(data, callback) {
			data.user= userObject;
			$.post(host + "/data", data, callback);
		}

		function drawChart(data) {
			if (data.success) {
			 	var graph = new google.visualization.DataTable();
			  	graph.addColumn('date', 'Date');
			   	graph.addColumn('number', 'Cups');
			   	var graphData = [];
				for (var i = 0; i < data.result.length; i++) {
					graphData.push([new Date(data[i].year, data[i].month, data[i].day), data[i].data]);
				}
				graph.addRows(graphData);
				var container = $("#chartHolder");
			  	var annotatedtimeline = new google.visualization.AnnotatedTimeLine(container);
			  	annotatedtimeline.draw(graph, {'displayAnnotations': true});
			} else {
				alert(data.response);
			}
		}
	}
}());