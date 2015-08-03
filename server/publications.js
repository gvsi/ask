Meteor.publish('posts', function(id) {
	var posts = Posts.find({course_id: id},{fields: {title: 1, text: 1, course_id: 1, created_at: 1, isAnonymous: 1, ownerIdenticon: 1, hasStudentAnswer: 1, hasInstructorAnswer: 1}},{sort: {created_at: -1}});
	//posts.forEach(function(v){ delete v.isAnonymous });
	return posts;
});

Meteor.publish('singlePost', function(id) {
	if (Posts.findOne({_id: id}).isAnonymous) {
		return Posts.find({_id: id},{fields: {owner: 0}});
	} else {
		return Posts.find({_id: id});
	}
});

Meteor.publish('coursesForStudent', function (user_id) {
	var courses = Meteor.users.findOne({_id: user_id},{'profile.courses': true}).profile.courses;
	if (!courses) {
		throw new Meteor.Error("Student does not exist in database");
	}
	return Courses.find({'_id': {$in: courses}, 'year': '2014/5', $or: [{'semester':'SEM2'}, {'semester':'YR'}]});
});

Meteor.publish('singleUser', function(id) {
 	return Meteor.users.find({_id: id},{fields: {'profile.name': 1, 'profile.surname': 1}});
});

Meteor.publish('answers', function (post_id) {
	return Answers.find({'postId': post_id},{sort: {isInstructor: -1, voteCount: -1, created_at: 1}});
});

Meteor.publish("notifications", function(userId){
	return Notifications.find({"userId": userId});
});
