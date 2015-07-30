var observingNotificationChanges;

Template.sideBar.rendered = function (){
	//Initialize Pages Side Bar
	$('[data-pages="sidebar"]').each(function() {
		 var $sidebar = $(this)
		 $sidebar.sidebar($sidebar.data())
	})

	var notificationsLoaded = false;
	Meteor.subscribe("notifications", Meteor.userId(), function () {
		 notificationsLoaded = true;
	});

	if(!observingNotificationChanges){
		observingNotificationChanges = Notifications.find().observeChanges({
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
	}
};

Template.sideBar.helpers({
	courses: function () {
		Meteor.subscribe('coursesForStudent', Meteor.userId(), {reactive:false});
		return Courses.find().fetch();
	},
	courseInitials: function () {
		return this.courseCode.substring(0,2);
	}
});
