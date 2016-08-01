Template.header.helpers({
	identiconHash: function() {
		return Package.sha.SHA256(Meteor.user()._id);
	},
	notifications: function(){
		var notifications = Notifications.find({}, {sort: {createdAt: -1}});
		if(notifications){
			return notifications;
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
		if(resultText.length > 100){
			return resultText.substring(0,100) + "…";
		}else{
			return resultText;
		}
	},
	isSeen: function(){
		if(this.seen){
			return "";
		}else{
			return "bg-warning-lighter";
		}
	},
	areThereUnseenNotifications: function(){
		var notifications = Notifications.find({seen: false});
		if(notifications && notifications.count() > 0){
			return true;
		}else{
			return false;
		}
	},
	searchBarText: function() {
		var searchString = Session.get('searchString');
		if (searchString) {
			return "<span class=\"bold\">"+searchString+"</span>";
		} else {
			var courseId = Router.current().params.courseId;
			if (courseId) {
				var course = Courses.findOne(courseId);
				if (course)
					return "Search in <span class=\"bold\">" + course.name + "</span>";
			} else {
				return "Click here to <span class=\"bold\">search</span>";
			}
		}
	},
	queryId: function(){
		return 'p=' + this.postId;
	},
	notificationIcon: function(){
		var iconType = "";
		if (this.type == "instructorNote") {
			iconType = 'fa fa-file-o';
		} else if (this.type == "reportedPost") {
			iconType = "fa fa-exclamation-triangle";
		} else {
			iconType = 'fa fa-comment'
		}
		return iconType;
	},
	currentUserHasAvatar: function(){
		var user = Meteor.user();
		if(user && user.profile.image){
			return true;
		}else{
			return false;
		}
	},
	currentUserAvatar: function(){
		var user = Meteor.user();
		if(user && user.profile.image){
			return user.profile.image;
		}else{
			return "";
		}
	}
});

Template.header.events({
	"click .notification-list .dropdown-menu": function(event, template){
		event.stopPropagation();
	},
	"click #toggle-more-details": function(event, template){
		var p = $(event.currentTarget).closest('.heading');
		p.closest('.heading').children('.more-details').stop().slideToggle('fast', function() {
			p.toggleClass('open');
		});
	},
	"click #search-link": function(event) {
		if ($('#overlay-search').val() == "") {
			var searchString = Session.get('searchString');
			if (searchString) {
				$('#overlay-search').val(searchString);
				$('#overlay-search').focus();
				$('#overlay-search').keyup();
			}
		}
	},
	"click .notification-link": function(event, template){
		var notificationId = this._id;
		var postId = this.postId;
		var postCourseId = this.postCourseId;
		var type = this.type;

		Meteor.call("seeNotification", notificationId, function(error, result){
			if(error){
				console.log("error", error);
			}
		});

		$(".dropdown").removeClass("open");

		if (type == "instructorNote") {
			loadPage(postId, true);
			Router.go('room', {courseId: postCourseId}, {query: 'p='+postId});
		} else if (type == "reportedPost" || type == "reportedAnswer") {
			Router.go('violations');
		} else if (type == "answerToPost" || type == "commentToAnswer") {
			var answerId = this.answerId;
			loadPage(postId, true);
			Router.go('room', {courseId: postCourseId}, {query: 'p='+postId, hash: answerId});
		}
	},
	"click #markNotificationsRead": function(event, template){
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
		event.stopPropagation();
	},
	"click .see-all-notifications": function(event, template){
		Router.go('notifications');
	}
});
