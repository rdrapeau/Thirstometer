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
}());