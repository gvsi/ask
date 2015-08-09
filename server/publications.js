Meteor.publish('posts', function(id) {
	var posts = Posts.find({courseId: id, isDeleted: { $ne: true}},{fields: {revisionHistory: 0, followers: 0, tags: 0, type: 0, updatedAt: 0, upvoters: 0, isDeleted: 0}},{sort: {createdAt: -1}});
	//posts.forEach(function(v){ delete v.isAnonymous });
	return posts;
});

Meteor.publish('singlePost', function(id) {
	return Posts.find({_id: id, isDeleted: { $ne: true}},{fields: {userId: 0, revisionHistory: 0}});
});

Meteor.publish('coursesForStudent', function (userId) {
	var courses = Meteor.users.findOne({_id: userId},{'profile.courses': true}).profile.courses;
	if (!courses) {
		throw new Meteor.Error("Student does not exist in database");
	}

	return Courses.find({'_id': {$in: courses}});
});

Meteor.publish('singleUser', function(id) {
 	return Meteor.users.find({_id: id},{fields: {'profile.name': 1, 'profile.surname': 1}});
});

Meteor.publish('answers', function (postId) {
	return Answers.find({'postId': postId, isDeleted: {$ne: true}},{fields: {revisionHistory: 0}},{sort: {isInstructor: -1, isInstructorUpvoted: -1, voteCount: -1, createdAt: 1}});
});

Meteor.publish("notifications", function(userId){
	return Notifications.find({"userId": userId});
});

Meteor.startup(function () {
  UploadServer.init({
    tmpDir: process.env.PWD + '/.uploads/tmp',
    uploadDir: process.env.PWD + '/.uploads/',
    checkCreateDirectories: true //create the directories for you
  })
});
