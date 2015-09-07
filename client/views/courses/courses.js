Template.courses.rendered = function(){

}


Template.courses.helpers({
  allCourses: function(){
    Meteor.subscribe("allCourses");

    return Courses.find({}, {sort: {year: -1, semester: -1}}).fetch();
  }
});


Template.courses.events({
  "click .courseLink": function(event, template){
    Router.go('room', {courseId: this._id});
  }
});
