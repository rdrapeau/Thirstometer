(function() {
	var host = "http://173.255.120.22:1337";

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
			$.post(host + "/login", obj, callBack);
		});
	});

	function callBack(data) {
		if (data.success) {
			$("#login").hide();
			$("#main").show();
		} else {
			
		}
	}
}());