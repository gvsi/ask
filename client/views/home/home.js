Template.home.rendered = function(){
  	Session.set("DocumentTitle","Home | Ask");
}

Template.home.helpers({
  coursesCount: function(){
    var date = new Date();
    var year;

    if(moment(date).month() < 8){
      year = (moment(date).year()-1) + "/" + (moment(date).year()%10);
      semester = "SEM2";
    }else{
      year = (moment(date).year()) + "/" + ((moment(date).year()%10)+1);
      semester = "SEM1";
    }

    return Courses.find({'year': year, $or: [{'semester': semester}, {'semester':'YR'}]}).count();
  },
  courses: function(){
    var date = new Date();
    var year;

    if(moment(date).month() < 8){
      year = (moment(date).year()-1) + "/" + (moment(date).year()%10);
      semester = "SEM2";
    }else{
      year = (moment(date).year()) + "/" + ((moment(date).year()%10)+1);
      semester = "SEM1";
    }

    return Courses.find({'year': year, $or: [{'semester': semester}, {'semester':'YR'}]}).fetch();
  }
});

Template.home.events({
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


    'submit #login-form' : function(e, t){
      e.preventDefault();
      // retrieve the input field values
      var username = t.find('#login-username').value;

        // Trim and validate your fields here....

        // If validation passes, supply the appropriate fields to the
        // Meteor.loginWithPassword() function.
        Meteor.loginWithPassword(username, username, function(err){
        if (err) {
          console.log(err);
        } else
          console.log('success');
      });
         return false;
      },

    'click #logout' : function(e, t){
      Meteor.logout();
    }

  });
