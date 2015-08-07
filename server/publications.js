Meteor.publish('posts', function(id) {
	var posts = Posts.find({course_id: id, isDeleted: { $ne: true}},{fields: {owner: 0, revisionHistory: 0, followers: 0, tags: 0, type: 0, updated_at: 0, upvoters: 0}},{sort: {created_at: -1}});
	//posts.forEach(function(v){ delete v.isAnonymous });
	return posts;
});

Meteor.publish('singlePost', function(id) {
	if (Posts.findOne({_id: id}).isAnonymous) {
		return Posts.find({_id: id, isDeleted: { $ne: true}},{fields: {owner: 0}});
	} else {
		return Posts.find({_id: id, isDeleted: { $ne: true}});
	}
});

Meteor.publish('coursesForStudent', function (user_id) {
	var courses = Meteor.users.findOne({_id: user_id},{'profile.courses': true}).profile.courses;
	if (!courses) {
		throw new Meteor.Error("Student does not exist in database");
	}

	return Courses.find({'_id': {$in: courses}});
});

Meteor.publish('singleUser', function(id) {
 	return Meteor.users.find({_id: id},{fields: {'profile.name': 1, 'profile.surname': 1}});
});

Meteor.publish('answers', function (post_id) {
	return Answers.find({'postId': post_id, isDeleted: {$ne: true}},{sort: {isInstructor: -1, voteCount: -1, created_at: 1}});
});

Meteor.publish("notifications", function(userId){
	return Notifications.find({"userId": userId});
});
