var sub;

Template.sideBar.rendered = function (){
	//Initialize Pages Side Bar
	$('[data-pages="sidebar"]').each(function() {
		 var $sidebar = $(this)
		 $sidebar.sidebar($sidebar.data())
	})


	if(sub)
		sub.stop();

	console.log("subscribtion to notifications");
	var notificationsLoaded = false;
	 sub = Meteor.subscribe("notifications", Meteor.userId(), function () {
		 // at this point all new users sent down are legitimately new ones
		 notificationsLoaded = true;
	});

		Notifications.find().observeChanges({
			added: function(id, notification){
				if(notification.userId == Meteor.userId() && notificationsLoaded){
					 $('body').pgNotification({
														style: 'circle',
														title: notification.title,
														message: notification.text,
														type: notification.type,
														onShown: function(){
															$( ".alert:last" ).wrap( "<a href="+ notification.link +"></a>" );
														}
						}).show();
				}
			}
		});

};

Template.sideBar.helpers({
	courses: function () {
			console.log("subscribtion to courses");
		Meteor.subscribe('coursesForStudent', Meteor.userId(), {reactive:false});
		return Courses.find().fetch();
	},
	courseInitials: function () {
		return this.courseCode.substring(0,2);
	}
});
