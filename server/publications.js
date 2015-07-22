Meteor.publish('posts', function(id) {
	return Posts.find({course_id: id});
});

Meteor.publish('singlePost', function(id) {
 	return Posts.find({_id: id});
});

Meteor.publish('courses', function (user_id) {
	return Courses.find({'year': '2014/5', 'semester':'SEM2'});
})

Meteor.publish('singleStudent', function(uun) {
	return Students.find({'STU_CODE': uun.toUpperCase()});
})