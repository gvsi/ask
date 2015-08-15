Meteor.publish('posts', function(id) {
	if(Meteor.users.findOne(this.userId).profile.courses.indexOf(id) != -1){
		console.log('hello');
		var posts = Posts.find({courseId: id, isDeleted: { $ne: true}},{fields: {revisionHistory: 0, followers: 0, tags: 0, type: 0, updatedAt: 0, upvoters: 0, isDeleted: 0}},{sort: {createdAt: -1}});
		//posts.forEach(function(v){ delete v.isAnonymous });
		if(posts){
			return posts;
		}
	}
});

Meteor.publish('singlePost', function(id) {
	var post = Posts.find({_id: id, isDeleted: { $ne: true}},{fields: {userId: 0, followers: 0, revisionHistory: 0}});
	if(post && (Meteor.users.findOne(this.userId).profile.courses.indexOf(post.courseId) != 1)){
			return post;
	}
});


Meteor.publish('coursesForStudent', function () {
	var user = Meteor.users.findOne({_id: this.userId}, {fields: {'profile.courses': 1}});
	if (user) {
		courses = user.profile.courses;
		if (!courses) {
			throw new Meteor.Error("No courses for this student");
		}
		return Courses.find({'_id': {$in: courses}});
	}
});

Meteor.publish('singleUser', function(id) {
 	return Meteor.users.find({_id: id},{fields: {'profile.name': 1, 'profile.surname': 1}});
});

Meteor.publish('answers', function (postId) {
	var post = Posts.find({_id: postId, isDeleted: { $ne: true}});
	if(post && (Meteor.users.findOne(this.userId).profile.courses.indexOf(post.courseId) != 1)){
		var answer = Answers.find({'postId': postId, isDeleted: {$ne: true}},{fields: {revisionHistory: 0}},{sort: {isInstructor: -1, isInstructorUpvoted: -1, voteCount: -1, createdAt: 1}});
		if(answer){
			return answer;
		}
	}
});

Meteor.publish("notifications", function(){
	var userNotifications = Notifications.find({"userId": this.userId});
	if(userNotifications){
		return userNotifications;
	}
});

// Meteor.startup(function () {
//   UploadServer.init({
//     tmpDir: process.env.PWD + '/.uploads/tmp',
//     uploadDir: process.env.PWD + '/.uploads/feedback',
//     checkCreateDirectories: true
//   })
// });
