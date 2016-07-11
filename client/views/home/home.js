Template.home.rendered = function(){
  // close sidebar for mobile
  $("body").removeClass("sidebar-open");

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
};


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

    return Courses.find().fetch();
  }
});

Template.home.events({
  'click .courseFront' : function(e, t){
     Router.go('room', {courseId: this._id});
   },
});
