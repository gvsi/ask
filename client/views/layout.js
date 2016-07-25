Template.defaultLayout.rendered = function (){
	//INIT PAGES : API CALLS
	$('[data-pages="sidebar"]').sidebar();


	//Pages Progress Bar API
	$('[data-pages-progress="circle"]').each(function() {
		var $progress = $(this)
		$progress.circularProgress($progress.data())
	})
};

Template.body.events({
	"click .alert": function(e, template){
		var postId = $(e.currentTarget).attr('data-post-id');
		var postCourseId = $(e.currentTarget).attr('data-post-course-id');
		var type = $(e.currentTarget).attr('data-type');
		var notificationId = $(e.currentTarget).attr('data-notification-id');

		Meteor.call("seeNotification", notificationId, function(error, result){
			if(error){
				console.log("error", error);
			}
		});

		if (type == "instructorNote") {
			loadPage(postId, true);
			Router.go('room', {courseId: postCourseId}, {query: 'p='+postId});
		} else if (type == "reportedPost" || type == "reportedAnswer") {
			Router.go('violations');
		} else if (type == "answerToPost" || type == "commentToAnswer") {
			var answerId = $(e.currentTarget).attr('data-answer-id');
			loadPage(postId, true);
			Router.go('room', {courseId: postCourseId}, {query: 'p='+postId, hash: answerId});
		}

	}
});

Tracker.autorun(function(){
	Session.setDefault('DocumentTitle', 'Ask');
	document.title = Session.get("DocumentTitle");
});

Template.postLayout.helpers({
	courseId: function(){
		return Router.current().params.courseId;
	}
});
