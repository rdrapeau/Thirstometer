//login functionality, start app here
(function() {
	var host = "http://173.255.120.22:1337";
	var page = "/login";

	$(document).ready(function() {
		$("#submit").click(function() {
			var user = $("#username").val();
			var pass = $("#password").val();
			var obj = {
				"user" : {
					"username" : user,
					"password" : pass
				}
			};
			$.post(host + page, obj, callBack);
		});
		$("#newUser").click(function() {
			page = "/register";
		});
	});

	function callBack(data) {
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

		function handleDrinkPress() {
			var amount = $(this).data('amount');
			sendDrinkTransaction({"amount" : amount}, function(data) {

			});
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
				"user" : userObject
				"transaction" : {
					"datetime" : timeStamp,
					"data" : data
				}
			};
			$.post(host + "/drink", message, callback);
		}
		
	}
}());
