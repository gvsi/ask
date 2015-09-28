Template.home.rendered = function(){
  // close sidebar for mobile
  $("body").removeClass("sidebar-open")

  Session.set("DocumentTitle","Home | Ask");

  // Scrolly.
  $('.scrolly')
  .scrolly({
    speed: 1500,
    offset: -10
  });

  setTimeout(function () {
    $(".landing").removeClass('is-loading');
  }, 200);

  setTimeout(function () {
    $('.more').show(500);
  }, 4000);

  var user = Meteor.user();
  if(user){
    var lastCourse = user.profile.lastCourse;
    if(!lastCourse){
      setTimeout(function () {
        $("#welcomeModal").modal();
      }, 5000);
    }
  }
}


Template.home.helpers({
  courses: function(){
    var date = new Date();
    var year;

    if(moment(date).month() < 9){
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
  'click .courseFront' : function(e, t){
    Router.go('room', {courseId: this._id});
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
