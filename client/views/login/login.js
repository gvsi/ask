Template.loginPage.rendered = function(){
	Session.set("DocumentTitle", "Login | Ask");
	console.log(headers.get('remote_user'));
	var username = headers.get('remote_user');

	if (username && username != "(null)") {
		Meteor.call('hashedPass', username, function (error, response) {
			if (!error) {
				Meteor.loginWithPassword(username, response, function(err){
					if (err) {
						console.log(err);
					} else {
						if(Meteor.user().profile.emailPreferences == ''){
							Meteor.call("setEmailPreferences", 'onceADay', function(error, result){
								if(error){
									console.log("error", error);
								}
							});
						}

						if(Session.get("loginRedirect")){
							Router.go(Session.get("loginRedirect"));
						}else{
							console.log("no session");
							Router.go('/');
						}
					}
				});
			}
		});
	}
}


Template.loginPage.events({
	'submit #form-login' : function(e, t){
		e.preventDefault();
		// retrieve the input field values
		var username = t.find('#login-username').value.trim();

		// Trim and validate your fields here....

		// If validation passes, supply the appropriate fields to the
		// Meteor.loginWithPassword() function.

		Meteor.call('hashedPass', username, function (error, response) {
			if (!error) {
				Meteor.loginWithPassword(username, response, function(err){
					if (err) {
						console.log(err);
					} else {
						if(Meteor.user().profile.emailPreferences == ''){
							Meteor.call("setEmailPreferences", 'onceADay', function(error, result){
								if(error){
									console.log("error", error);
								}
							});
						}

						if(Session.get("loginRedirect")){
							Router.go(Session.get("loginRedirect"));
						}else{
							console.log("no session");
							Router.go('/');
						}
					}
				});
			}
		});

	}
})
