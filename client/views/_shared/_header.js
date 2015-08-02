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
	}
});
