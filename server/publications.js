Meteor.publish('posts', function(id) {
	return Posts.find({course_id: id},{fields: {title: 1, text: 1, course_id: 1, created_at: 1}},{sort: {created_at: -1}});
});

Meteor.publish('singlePost', function(id) {
 	return Posts.find({_id: id});
});

Meteor.publish('coursesForStudent', function (user_id) {
	var courses = Meteor.users.findOne({_id: user_id},{'profile.courses': true}).profile.courses;
	if (!courses) {
		throw new Meteor.Error("Student does not exist in database");
	}

	return Courses.find({'_id': {$in: courses}, 'AYR_CODE': '2014/5', $or: [{'PSL_CODE':'SEM2'}, {'PSL_CODE':'YR'}]});
});

Meteor.publish('singleUser', function(id) {
 	return Meteor.users.find({_id: id},{fields: {'profile.name': 1, 'profile.surname': 1}});
});

Meteor.publish('singleStudent', function(uun) {
	return Students.find({'STU_CODE': uun.toUpperCase()});
});

Meteor.publish('answers', function (post_id) {
	return Answers.find({'postId': post_id});
});