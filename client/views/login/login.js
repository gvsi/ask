Template.loginPage.events({
	'submit #register-form' : function(e, t) {
     e.preventDefault();
     var username = t.find('#account-username').value;

       // Trim and validate the input

     Accounts.createUser({username: username, password: username}, function(err){
         if (err) {
           console.log('error');
         } else {
           console.log('success');
         }

       });

     return false;
   },
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
