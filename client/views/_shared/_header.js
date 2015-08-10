Template.header.helpers({
	identiconHash: function() {
		return Package.sha.SHA256(Meteor.user()._id);
	},
	notifications: function(){
		var notifications = Notifications.find({}, {sort: {createdAt: -1}, limit: 4});
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
    	return resultText.substring(0,100) + "...";
		}else{
			return resultText;
		}
  },
	isSeen: function(){
		if(this.seen){
			return "";
		}else{
			return "unread";
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
	}
});

Template.header.events({
	"click .notification-list .dropdown-menu": function(event, template){
		event.stopPropagation();
	},
	"click #notification-center": function(event, template){
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
  }
});
