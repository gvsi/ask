Template.loginPage.events({
	'submit #form-login' : function(e, t){
      e.preventDefault();
      // retrieve the input field values
      var username = t.find('#login-username').value;

        // Trim and validate your fields here....

        // If validation passes, supply the appropriate fields to the
        // Meteor.loginWithPassword() function.
        Meteor.loginWithPassword(username, username, function(err){
        if (err) {
          console.log(err);
        } else {					
          Router.go('/');
        }
      });
         return false;
      }
})
