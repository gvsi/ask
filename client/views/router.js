Router.configure({
  loadingTemplate: 'loading',
  notFoundTemplate: 'page404'
});

var OnBeforeActions;

OnBeforeActions = {
  loginRequired: function(pause) {
    if (!Meteor.userId()) {
      if(Iron.Location.get().path != '/login'){
        Session.set("loginRedirect", Iron.Location.get().path);
      }
      Router.go('login');
    }else{
      this.next();
    }
  }
};

Router.onBeforeAction(OnBeforeActions.loginRequired, {
  except: ['login']
});

Router.route('/', function () {
  var course = Meteor.users.findOne({_id: Meteor.userId()});
  if(course){
    var lastCourse = course.profile.lastCourse;
    if(lastCourse){
      Router.go('room', {courseId: lastCourse});
    }else{
      Router.go('home');
    }
  }
});

Router.route('/home', function () {
  this.render('home');
},{
  layoutTemplate:"dashboardLayout",
  name:'home',
});

Router.route('/settings', function () {
  this.render('settings');
},{
  layoutTemplate:"defaultLayout",
  name:'settings',
});

Router.route('/courses', function () {
  this.render('courses');
},{
  layoutTemplate:"defaultLayout",
  name:'courses',
});


Router.route('/feedback', function () {
  this.render('feedback');
},{
  layoutTemplate:"defaultLayout",
  name:"feedback",
  loadingTemplate: 'loading',
});

Router.route('/room/:courseId', function () {
  this.render('postPage');
},{
  layoutTemplate:"postLayout",
  name:"room",
  loadingTemplate: 'loading',
  fastRender: true,
  waitOn: function() {
    if (Meteor.userId()) {
      //console.log("subscribing");
      data = [
        Meteor.subscribe('posts', this.params.courseId),
        Meteor.subscribe('courseStats', this.params.courseId)
      ];
      if (!Session.get("coursesAreReady")) {
        data.push(Meteor.subscribe('coursesForStudent', {onReady: function() {
          //console.log("COURSES ARE READY!!");
          Session.set("coursesAreReady", true)
        }}));
      }
      return data;
    }
  },
  data: function() {
    //console.log(Courses.findOne(this.params.courseId));
    if (Session.get("coursesAreReady") && (!Courses.findOne(this.params.courseId) || (this.params.query.p && !Posts.findOne(this.params.query.p)))) {
      this.render('page404');
    }
  }
});


Router.route('room/:courseId/compose', function () {
  this.render('postCompose');
},{
  layoutTemplate:"composePostLayout" ,
  loadingTemplate: 'loading',
  name: 'compose',
  waitOn: function() {
    if (Meteor.userId()) {
      return [
        Meteor.subscribe('posts', this.params.courseId),
      ];
    }
  }
});

Router.route('room/:courseId/compose?p=:postId', {name: 'editPost'});

Router.route('/notifications', function () {
  this.render('notifications');
},{
  layoutTemplate:"notificationsLayout",
  loadingTemplate: 'loading',
  name: 'notifications'
});

Router.route('/login', function() {
  this.render('loginPage');
}, {
  layoutTemplate:"loginLayout",
  loadingTemplate: 'loading',
  name: 'login',
});

Router.route('/settings/unsubscribe', function () {
  Meteor.call("setEmailPreferences", "never", function(error, result){
    if(error){
      console.log("error", error);
    }
    if(result){

    }
  });
  Router.go('/settings');
},{
  layoutTemplate:"defaultLayout"
});

Router.route('/logout', function () {
  Meteor.logout(function() {
    // Redirect to login
    Object.keys(Session.keys).forEach(function(key){ Session.set(key, undefined); })
    Session.set("areNotificationsObserved", true);
    Router.go('/login');
  });
},{
  layoutTemplate:"defaultLayout"
});
