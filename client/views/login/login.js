Template.loginPage.events({
	'submit #form-login' : function(e, t){
      e.preventDefault();
      // retrieve the input field values
      var username = t.find('#login-username').value;

        // Trim and validate your fields here....

        // If validation passes, supply the appropriate fields to the
        // Meteor.loginWithPassword() function.
        Meteor.loginWithPassword(username, username, function(err){
        if (err) {
          console.log(err);
        } else {
					Meteor.subscribe('coursesForStudent', Meteor.userId(), {reactive:false,
					onReady: function(){
						 Session.set('coursesLoaded', true);
					}});

					Meteor.subscribe("notifications", Meteor.userId(), {
						onReady: function() {
							var initial = true;
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
							initial = false;
						}
					});
					
          Router.go('/');
        }
      });
         return false;
      }
})
