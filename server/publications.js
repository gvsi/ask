Meteor.publish('posts', function(id) {
	if(Meteor.users.findOne(this.userId).profile.courses.indexOf(id) != -1){
		var self = this;
		var cursor = Posts.find({courseId: id, isDeleted: { $ne: true}},{fields: {revisionHistory: 0, followers: 0, tags: 0, type: 0, updatedAt: 0, upvoters: 0, isDeleted: 0}},{sort: {createdAt: -1}});

		cursor.forEach(function(doc) {
			if (doc.viewers.indexOf(self.userId) != -1) {
				doc.viewers = [self.userId];
			} else {
				doc.viewers = [];
			}
      self.added('posts', doc._id, doc);
    }, self);

		var handle = cursor.observeChanges({
	    added: function (id, fields) {
	      self.added("posts", id, fields);
	    },
	    changed: function(id, fields) {
	      self.changed("posts", id, fields);
	    },
	    removed: function (id) {
	      self.removed("posts", id);
	    }
	  });

    self.ready();

		self.onStop(function () {
			handle.stop();
		});

	}
});

Meteor.publish('singlePost', function(id) {
	var post = Posts.find({_id: id, isDeleted: { $ne: true}},{fields: {userId: 0, upvoters: 0, followers: 0, viewers: 0, revisionHistory: 0}});
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
