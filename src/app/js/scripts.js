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
		$(".loggedout").hide();
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
			$("html, body").animate({ scrollTop: $(document).height() }, "slow");
		});	
		
		google.load('visualization', '1', {'packages':['annotatedtimeline'], "callback" : function() {
			console.log("Chart API loaded.");
			getTransactions({}, drawChart);
		}});

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
				console.log("Drink recorded");
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
					"date" : date.getTime(),
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
			   	var sum = 0;
				for (var i = 0; i < data.result.length; i++) {
					sum += data.result[i].data.amount * 1;
					var dt = new date();
					dt.setTime(data.result[i].date * 1000);
					graphData.push([dt, sum]);
				}
				$("#totalCups").html("Total Cups Drank: " + sum);
				graph.addRows(graphData);
				var container = document.getElementById("chartHolder");
			  	var annotatedtimeline = new google.visualization.AnnotatedTimeLine(container);
			  	annotatedtimeline.draw(graph, {'displayAnnotations': true});
			} else {
				alert(data.response);
			}
		}
	}
}());