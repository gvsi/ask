var observingNotificationChanges;

Template.sideBar.rendered = function (){
	//Initialize Pages Side Bar
	$('[data-pages="sidebar"]').each(function() {
		var $sidebar = $(this)
		$sidebar.sidebar($sidebar.data())
	})

	Meteor.subscribe("notifications", Meteor.userId(), {
		onReady: function() {
			var initial = true;
			if(!observingNotificationChanges){
					Notifications.find().observeChanges({
						added: function(id, notification){
							if(notification.userId == Meteor.userId()){
								if (!initial) {
									$('body').pgNotification({
										style: 'circle',
										title: notification.intend,
										message: notification.postTitle,
										type: notification.type,
										thumbnail: '<div class="timeline-point success" style="margin-left: 12px;margin-top: -2px;"><i class="pg-comment"></i></div>',
										onShown: function(){
											$( ".alert:last" ).wrap( "<a href="+ notification.link +"></a>" );
										}
									}).show();

									Meteor.call("seeNotification", id, function(error, result){
										if(error){
											console.log("error", error);
										}
										if(result){

										}
									});
								}
							}
						}
					});
			}
			initial = false;
		}
	});
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
