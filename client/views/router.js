Router.configure({
    loadingTemplate: 'loading',
});

var OnBeforeActions;

OnBeforeActions = {
    loginRequired: function(pause) {
      if (!Meteor.userId()) {
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
 waitOn: function() {
    $(".toggle-post-sidebar").remove();
    //$(".header-inner").prepend("<a href=\"#\" class=\"toggle-email-sidebar\">Room <span class=\"text-info\">(12)</span> <span class=\"caret\"></span></a>");
    return [
      Meteor.subscribe('posts', this.params.courseId),
      Meteor.subscribe('courseStats', this.params.courseId)
    ];
  }
});


Router.route('room/:courseId/compose', function () {
  this.render('postCompose');
},{
 layoutTemplate:"composePostLayout" ,
  loadingTemplate: 'loading',
  name: 'compose',
  waitOn: function() {
    return [
      Meteor.subscribe('posts', this.params.courseId),
    ];
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
