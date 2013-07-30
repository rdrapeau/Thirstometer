//login functionality, start app here
(function() {
	var host = "http://173.255.120.22:1337";
	$(document).ready(function() {
		$("#submit").click(function() {
			submitLogin("/login")
		});
		
		$("#registerSubmit").click(function() {
			submitLogin("/register");
		});
	});

	function submitLogin(page) {
		var user = $("#username").val();
		var pass = $("#password").val();
		var obj = {
			"user" : {
				"username" : user,
				"password" : pass
			}
		};
		$.post(host + page, obj, loginResponse);
	}

	function loginResponse(data) {
		if (data.success) {
			$("#login").hide();
			mainApp(data.user);
		} else {
			alert(data.response);
		}
	}

	function mainApp(user) {
		var userObject = user;
		$("#main").show();
		$(".drinkingButton").click(handleDrinkPress);
		$("#customSubmit").click(handleDrinkCustom);

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
