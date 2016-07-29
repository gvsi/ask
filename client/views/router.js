Router.configure({
    loadingTemplate: 'loading'
});

var OnBeforeActions;

OnBeforeActions = {
    loginRequired: function(pause) {
        if (!Meteor.userId()) {
            if (Iron.Location.get().path != '/login') {
                Session.set("loginRedirect", Iron.Location.get().path);
            }
            Router.go('login');
        } else {
            Meteor.call("userIsAdmin", function (error, result) {
                    if (error) {
                        console.log("error", error);
                    }
                    return Session.set('userIsAdmin', result);
                }
            );
            this.next();
        }
    }
};

Router.onBeforeAction(OnBeforeActions.loginRequired, {
    except: ['login', 'healthcheck']
});

Router.route('/', function () {
    var user = Meteor.user();
    if (user) {
        if (this.params.query.course) {
            var courseCode = this.params.query.course;
            Meteor.subscribe("coursesForUser", {
                onReady: function() {
                    var courseRedirect = Courses.findOne({courseCode : courseCode});

                    if (courseRedirect) {
                        Router.go('room', {courseId: courseRedirect._id});
                    } else {
                        Router.go('page404');
                    }
                }
            });
        } else {
            var lastCourse = user.profile.lastCourse;
            if (lastCourse) {
                Router.go('room', {courseId: lastCourse});
            } else {
                Router.go('home');
            }
        }
    }
});

Router.route('/home', function () {
    this.render('home');
},{
    layoutTemplate:"homeLayout",
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

Router.route('/healthcheck', function () {
    this.render('healthcheck');
},{
    layoutTemplate:"defaultLayout",
    name:'healthcheck',
});

Router.route('/violations', function () {
    this.render('violations');
},{
    layoutTemplate:"defaultLayout",
    name:'violations',
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
            data = [
                Meteor.subscribe('posts', this.params.courseId),
                Meteor.subscribe('courseStats', this.params.courseId),
                Meteor.subscribe('coursesForUser'),
                Meteor.subscribe('reportedPosts')
            ];
            return data;
        }
    },
    data: function() {
        if (this.params.query.p) {
            return {
                isTherePost: true
            }
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
                Meteor.subscribe('reportedPosts')
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

Router.route('/error', function() {
    this.render('page404');
}, {
    layoutTemplate:"defaultLayout",
    loadingTemplate: 'loading',
    name: 'page404'
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
        Cookie.set("cosign-eucsCosigndev-dev.ask.sli.is.ed.ac.uk",null);
        window.location.replace("https://www.ease.ed.ac.uk/logout.cgi");
        //Router.go('/login');
    });
},{
    layoutTemplate:"defaultLayout"
});
