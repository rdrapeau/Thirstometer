var databaseUrl = 'waterdb';
var collections = ["users"];
var db = require("mongojs").connect(databaseUrl, collections);
var ObjectId = db.ObjectId;


exports.addDrink = function(obj, callback){
	var toret ={};
	db.users.update(
		{"username" : obj.user.username},
		{$push: {"drinks" : obj.transaction}},
		function(err, updated){
			if(err || !updated) {
				toret.success = false;
				toret.response = "error saving";
				callback(toret);
			} else {
				toret.success = true;
				toret.response = "success";
				callback(toret);
			}
		}
	);
};

exports.addUser = function(obj, callback){
	var resp = {};
	exports.findUserByNameNoPass(obj.username, function(data){
		if(data.success){
			resp.success = false;
			resp.response = "username taken";
			resp.user = null;
			callback(resp);
		} else {
			db.users.save(obj, function(err, saved){
				if(err || !saved){
					resp.success = false;
					resp.response = "error saving";
					resp.user = null;
					callback(resp);
				} else {
					resp.success = true;
					resp.response = "user created!";
					resp.user = saved;
					callback(resp);
					exports.editUser(saved, "drinks", []);
				}
			});
		}
	});
};

exports.verifyPass = function(obj, callback){
	var resp = {}
	exports.findUserByName(obj.username, function(back){
		if(back.success){
			if(obj.password == back.user.password){
				resp.success = true;
				resp.response = "passwords match!";
				callback(resp);
			} else {
				resp.success = false;
				resp.response = "passwords dont match";
				callback(resp);
			}
		} else {
			resp.success = false;
			resp.response = "user not found";
			callback(resp);
		}
	});
};

exports.findUserByName = function(name, callback){
	var userBack = {};
	db.users.find({"username" : name}, function(err, data){
		if(err){
			userBack.success = false;
			userBack.response = "error finding user";
			userBack.user = null;
			callback(userBack);
		} else if (!data.length){
			userBack.success = false;
			userBack.response = "user does not exist";
			userBack.user = null;
			callback(userBack);
		} else {
			userBack.success = true;
			userBack.response = "success";
			userBack.user = data[0];
			callback(userBack);
		}
	});
};

exports.findUserByNameNoPass = function(name, callback){
	var userBack = {};
	db.users.find({"username" : name}, function(err, data){
		if(err){
			userBack.success = false;
			userBack.response = "error finding user";
			userBack.user = null;
			callback(userBack);
		} else if (!data.length){
			userBack.success = false;
			userBack.response = "user does not exist";
			userBack.user = null;
			callback(userBack);
		} else {
			userBack.success = true;
			userBack.response = "success";
			userBack.user = data[0];
			delete userBack.user.password;
			callback(userBack);
		}
	});
};

exports.findUserByID = function(name, callback){
	var userBack = {};
	db.users.find({"_id" : name}, function(err, data){
		if(err){
			userBack.success = false;
			userBack.response = "error finding user";
			userBack.user = null;
			callback(userBack);
		} else if (!data.length){
			userBack.success = false;
			userBack.response = "user does not exist";
			userBack.user = null;
			callback(userBack);
		} else {
			userBack.success = true;
			userBack.response = "success";
			userBack.user = data[0];
			callback(userBack);
		}
	});
};

exports.findUserByIDNoPass = function(obj, callback){
	var userBack = {};
	db.users.find({"_id" : name}, function(err, data){
		if(err){
			userBack.success = false;
			userBack.response = "error finding user";
			userBack.user = null;
			callback(userBack);
		} else if (!data.length){
			userBack.success = false;
			userBack.response = "user does not exist";
			userBack.user = null;
			callback(userBack);
		} else {
			userBack.success = true;
			userBack.response = "success";
			userBack.user = data[0];
			delete userBack.user.password;
			callback(userBack);
		}
	});
};

exports.makeHash = function(obj){
	var hash = require('crypto').createHash('md5').update(obj["password"]).digest("hex");
	return hash;
};

exports.editUser = function(obj, field, changeTo){
	var data = {};
	data[field] = changeTo;
	db.users.update(obj,{$set : data}, function(err, updated){
		if(err || !updated){
			console.log("Error, user info not updated");
		} else {
			console.log("User info updated");
		}
	});
};

exports.totalDrinks = function(transactions) {
	var sum = 0;
	for(var drink in transactions) {
		sum += drink.data.amount;
	}
	return sum;
}

exports.drinksOnDay = function(user, day, month, year, callback) {
	exports.findUserByName(user.username, function(back) {
		if(back.success) {
			var userObj = back.user;
			var drinks = [];
			for(var drink in userObj.drinks) {
				if(drink.day == day && drink.month == month && drink.year == year)
					drinks.push(drink);
			}
			callback(drinks);
		}
	});
}

exports.drinksAll = function(user, callback) {
	exports.findUserByName(user.username, function(back) {
		if(back.success) {
			var userObj = back.user;
			var drinks = [];
			for(var drink in userObj.drinks) {
				drinks.push(drink);
			}
			callback(drinks);
		}
	});
}

exports.removes = function(){
	db.users.remove({}, function(err, removed){
		if(err || !removed){
			console.log("errrror");
		} else {
			console.log("yay");
		}
	});
}