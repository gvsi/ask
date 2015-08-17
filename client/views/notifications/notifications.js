Template.notifications.rendered = function(){
		//Set Title
		Session.set("DocumentTitle","Notifications | Ask");

		var $timeline_block = $('.timeline-block');

		//hide timeline blocks which are outside the viewport
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
  }
});
