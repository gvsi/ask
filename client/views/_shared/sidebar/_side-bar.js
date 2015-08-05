var observingNotificationChanges;

Meteor.startup(function(){
	console.log("i am subscribing we");
	Meteor.subscribe('coursesForStudent', Meteor.userId(), {reactive:false,
	onReady: function(){
		 Session.set('coursesLoaded', true);
	}});
});

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
	currentCourses: function () {

		var date = new Date();
		var year;

		if(moment(date).month() < 8){
			year = (moment(date).year()-1) + "/" + (moment(date).year()%10);
			semester = "SEM2";
		}else{
			year = (moment(date).year()) + "/" + ((moment(date).year()%10)+1);
			semester = "SEM1";
		}

		return Courses.find({'year': year, $or: [{'semester': semester}, {'semester':'YR'}]}).fetch();
	},
	pastCourses: function (){
		 if (Session.get('coursesLoaded') == true) {
				var pastYears = [];
				var date = new Date();
				var year, courses, coursesArray, offset = 0;

				if(moment(date).month() < 8){
					offset=1;
					year = (moment(date).year()-1) + "/" + (moment(date).year()%10);
					courses = Courses.find({'year': year, $or: [{'semester': "SEM1"}, {'semester':'YR'}]});
					coursesArray = [];

					courses.forEach(function(course){
						coursesArray.push({
							_id: course._id,
							name: course.name,
							initials: course.courseCode.substring(0,2)
						});
					});

					yearThumbnail = (moment(date).year()%100-1) + "/" + (moment(date).year()%10);

					pastYears.push({
						yearThumbnail: yearThumbnail,
						name: "Sem 1 - " + year,
						coursesArray: coursesArray
					});
				}

				for (var i = 1; i <= 5; i++) {
					year = (moment(date).year()-offset-i) + "/" + (moment(date).year()%10+1-offset-i);
					courses = Courses.find({'year': year});
				//	console.log(year);
						if(courses.count()){
					//	console.log("inside");
							coursesArray = [];

							courses.forEach(function(course){
								coursesArray.push({
									_id: course._id,
									name: course.name,
									initials: course.courseCode.substring(0,2)
								});
							});

							yearThumbnail = (moment(date).year()%100-offset-i) + "/" + (moment(date).year()%10+1-offset-i);

							pastYears.push({
								yearThumbnail: yearThumbnail,
								name: "Year - " + year,
								coursesArray: coursesArray
							});
					}else{
						break;
					}
				}

				console.log(pastYears);
				return pastYears;
			}
	},
	arePastCourses: function(){
		var date = new Date();
		var year;

		if(moment(date).month() < 8){
			year = (moment(date).year()-2) + "/" + (moment(date).year()%10-1);
		}else{
			year = (moment(date).year()-1) + "/" + ((moment(date).year()%10));
		}

		var courses = Courses.find({'year': year});

		if(courses && courses.count()){
			return true;
		}else{
			return false;
		}

	},
	courseInitials: function () {
		return this.courseCode.substring(0,2);
	}
});
