Router.configure({
    loadingTemplate: 'loading',
/*    waitOn: function() {
        return [
          //Meteor.subscribe('courses', Meteor.userId()),
          //Meteor.subscribe("singleStudent", Meteor.user().username.toUpperCase())
        ];
    }
*/});

Router.route('/', function () {
  this.render('blankPage');
},{
 name: "home",
 layoutTemplate:"dashboardLayout"
});

Router.route('/social', function () {
  this.render('socialApp');
},{
 layoutTemplate:"socialLayout",
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
      Meteor.subscribe('posts', this.params.courseId)
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

//Router.route('room/:courseId/compose?p=:postId', {name: 'editPost'});
Router.route('room/:courseId??p=:postId', {name: 'showPost'});

Router.route('room/:courseId/compose?p=:postId', {name: 'editPost'});

// Router.route('room/:courseID/compose?p=:postId', function () {
//   this.render('postCompose');
// },{
//  layoutTemplate:"composePostLayout" ,
//   loadingTemplate: 'loading',
//   name: 'editPost',
//   waitOn: function() {
//     return [
//       Meteor.subscribe('posts', this.params.courseId),
//     ];
//   }
// });

Router.route('/notifications', function () {
  this.render('notifications');
},{
  layoutTemplate:"defaultLayout",
  loadingTemplate: 'loading',
  name: 'notifications'
});

Router.route('/calendar', function () {
  this.render('calendarApp');
},{
 layoutTemplate:"calendarLayout"
});

//UI ELEMENTS
//1. COLOR PAGE
Router.route('/ui/color', function () {
  this.render('uiColor');
},{
 layoutTemplate:"defaultLayout"
});

//2. TYPO PAGE
Router.route('/ui/typo', function () {
  this.render('uiTypo');
},{
 layoutTemplate:"defaultLayout"
});

//3. Icons PAGE
Router.route('/ui/icons', function () {
  this.render('uiIcons');
},{
 layoutTemplate:"defaultLayout"
});

//4. Buttons PAGE
Router.route('/ui/buttons', function () {
  this.render('uiButtons');
},{
 layoutTemplate:"defaultLayout"
});

//5. Notifications PAGE
Router.route('/ui/notifications', function () {
  this.render('uiNotifications');
},{
 layoutTemplate:"defaultLayout"
});

//6. Modals PAGE
Router.route('/ui/modals', function () {
  this.render('uiModals');
},{
 layoutTemplate:"defaultLayout"
});

//7. Progress PAGE
Router.route('/ui/progress', function () {
  this.render('uiProgress');
},{
 layoutTemplate:"defaultLayout"
});

//8. Progress PAGE
Router.route('/ui/tabs_accordian', function () {
  this.render('uiTabs');
},{
 layoutTemplate:"defaultLayout"
});

//9. Progress PAGE
Router.route('/ui/sliders', function () {
  this.render('uiSliders');
},{
 layoutTemplate:"defaultLayout"
});

//10. Tree-view PAGE
Router.route('/ui/tree-view', function () {
  this.render('uiTreeView');
},{
 layoutTemplate:"defaultLayout"
});

//11. Tree-view PAGE
Router.route('/ui/nestables', function () {
  this.render('uiNestables');
},{
 layoutTemplate:"defaultLayout"
});

Router.route('/forms/elements', function () {
  this.render('formElments');
},{
 layoutTemplate:"defaultLayout"
});

Router.route('/forms/layouts', function () {
  this.render('formLayouts');
},{
 layoutTemplate:"defaultLayout"
});

Router.route('/forms/wizard', function () {
  this.render('formWizard');
},{
 layoutTemplate:"defaultLayout"
});

Router.route('/login', function() {
  this.render('loginPage');
}, {
  layoutTemplate:"loginLayout"
});

Router.route('/logout', function () {
  Meteor.logout(function() {
      // Redirect to login
      Session.set("areNotificationsObserved", true);
      Router.go('/login');
    });
},{
 layoutTemplate:"defaultLayout"
});
