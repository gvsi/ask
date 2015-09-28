Meteor.loginWithEase = function(callback) {
	var username = headers.get('remote_user');
  if (username && username != "(null)") {
    var loginRequest = {ease: true, uun: username};

    Accounts.callLoginMethod({
      methodArguments: [loginRequest],
      userCallback: callback
    });
  }
};

// Meteor.loginWithPassword = function(callback) {
// 	return undefined;
// }

Template.loginPage.rendered = function(){
	Session.set("DocumentTitle", "Login | Ask");

  Meteor.loginWithEase(function(err){
    if (err) {
      if (err.error == "invalid-user")
        $("label.error").html("It seems like you are not enabled to use Ask (you are probably not taking any course using Ask).<br>Think this is a mistake? Contact us.")
      console.log(err);
    } else {
      if(Meteor.user().profile.emailPreferences == ''){
        Meteor.call("setEmailPreferences", 'realTime', function(error, result){
          if(error){
            console.log("error", error);
          }
        });
      }
      if(Session.get("loginRedirect")){
        Router.go(Session.get("loginRedirect"));
      }else{
        Router.go('/');
      }
    }
  });
}


Template.loginPage.events({
	'submit #form-login' : function(e, t){
		e.preventDefault();
		// retrieve the input field values
		var username = t.find('#login-username').value.trim();

			// Trim and validate your fields here....

			// If validation passes, supply the appropriate fields to the
			// Meteor.loginWithPassword() function.
			Meteor.loginWithPassword(username, username, function(err){
			if (err) {
				console.log(err);
			} else {

				if(Meteor.user().profile.emailPreferences == ''){
					Meteor.call("setEmailPreferences", 'realTime', function(error, result){
						if(error){
							console.log("error", error);
						}
					});
				 }

				Router.go('/');
			}
		});
			 return false;
		}

})
