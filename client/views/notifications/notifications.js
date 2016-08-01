Template.notifications.rendered = function(){
	// close sidebar for mobile
	$("body").removeClass("sidebar-open")

	//Set Title
	Session.set("DocumentTitle","Notifications | Ask");

	//hide timeline blocks which are outside the viewport
	setTimeout(function () {
		var $timeline_block = $('.timeline-block');

		$timeline_block.each(function(){
			if($(this).offset().top > $(window).scrollTop()+$(window).height()*0.75) {
				$(this).find('.timeline-point, .timeline-content').addClass('is-hidden');
			}
		});

		//on scolling, show/animate timeline blocks when enter the viewport
		$(window).on('scroll', function(){
			$timeline_block.each(function(){
				if( $(this).offset().top <= $(window).scrollTop()+$(window).height()*0.75 && $(this).find('.timeline-point').hasClass('is-hidden') ) {
					$(this).find('.timeline-point, .timeline-content').removeClass('is-hidden').addClass('bounce-in');
				}
			});
		});
	}, 500);

	var notifications = Notifications.find({seen: false}).fetch();
	notifications.forEach(function (notification) {
		Meteor.call("seeNotification", notification._id , function(error, result){
			if(error){
				console.log("error", error);
			}
			if(result){

			}
		});
	});
}

Template.notifications.events({
	"click .notification-card-link": function(event, template){
		var postId = this.postId;
		var postCourseId = this.postCourseId;
		var type = this.type;

		$(".dropdown").removeClass("open");

		if(type == "instructorNote"){
			loadPage(postId, true);
			Router.go('room', {courseId: postCourseId}, {query: 'p='+postId});
		}else if (type == "answerToPost" || type == "commentToAnswer") {
			var answerId = this.answerId;
			loadPage(postId, true);
			Router.go('room', {courseId: postCourseId}, {query: 'p='+postId, hash: answerId});
		}
	},
});

Template.notifications.helpers({
	notifications: function(){
		var notifications = Notifications.find({}, {sort: {createdAt: -1}});
		if(notifications){
			return notifications;
		}
	},
	hasNotifications: function(){
		var notificationsCount = Notifications.find({}, {sort: {createdAt: -1}}).count();
		if(notificationsCount){
			return true;
		}else{
			return false;
		}
	},
	dateFromNow: function() {
		return moment(this.createdAt).fromNow();
	},
	textWithoutTags: function() {
		var dummyNode = document.createElement('div'),
			resultText = '';
		dummyNode.innerHTML = this.text;
		resultText = dummyNode.innerText || dummyNode.textContent
		if(resultText.length > 350){
			return resultText.substring(0,350) + "...";
		}else{
			return resultText;
		}
	},
	iconType: function(){
		var iconType="";
		if(this.type == "instructorNote"){
			iconType = '  <div class="timeline-point warning"><i style="margin-left:-6px;" class="fa fa-file-o"></i></div>';
		} else if (this.type == "reportedPost" || this.type == "reportAnswer") {
			iconType = '  <div class="timeline-point warning"><i class="fa fa-exclamation-triangle"></i></div>';
		} else {
			iconType = '  <div class="timeline-point success"><i class="pg-comment"></i></div>';
		}

		return iconType
	},
	postedIn: function(){
		var course = Courses.findOne({_id: this.postCourseId});
		if(course){
			return 'posted in ' + course.name;
		}
	}
});
