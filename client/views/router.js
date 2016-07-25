Router.configure({
    loadingTemplate: 'loading'
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

    var user = Meteor.user();
    if(user){

        var courseRedirect = Courses.findOne({courseCode : this.params.query.course});
        if(courseRedirect){
            Router.go('room', {courseId: courseRedirect._id});
        }else{
            var lastCourse = user.profile.lastCourse;
            if(lastCourse){
                Router.go('room', {courseId: lastCourse});
            }else{
                Router.go('home');
            }
        }
    }
}, {
    waitOn: function () {
        Meteor.subscribe('coursesForStudent');
    }});

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
                Meteor.subscribe('coursesForStudent')
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
