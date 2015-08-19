Meteor.publish('posts', function(id) {
	if(Meteor.users.findOne(this.userId).profile.courses.indexOf(id) != -1){
		var self = this;
		var cursor = Posts.find({courseId: id, isDeleted: { $ne: true}},{fields: {revisionHistory: 0, tags: 0, type: 0, updatedAt: 0, isDeleted: 0}},{sort: {createdAt: -1}});

		var handle = cursor.observeChanges({
			added: function (id, doc) {
				var d = checkFields(doc);
				self.added("posts", id, d);
			},
			changed: function(id, doc) {
				var d = checkFields(doc);
				self.changed("posts", id, d);
			},
			removed: function (id) {
				self.removed("posts", id);
			}
		});

		function checkFields(doc) {
			//followers
			if (doc.followers) {
				if (doc.followers.indexOf(self.userId) != -1) {
					doc.followers = [self.userId];
				} else {
					doc.followers = [];
				}
			}

			// Viewers
			if (doc.viewers) {
				if (doc.viewers.indexOf(self.userId) != -1) {
					doc.viewers = [self.userId];
				} else {
					doc.viewers = [];
				}
			}

			// Upvoters
			if (doc.upvoters) {
				if (doc.upvoters.indexOf(self.userId) != -1) {
					doc.upvoters = [self.userId];
				} else {
					doc.upvoters = [];
				}
			}

			// Users Live Answering
			if (doc.usersLiveAnswering) {
				doc.usersLiveAnsweringCount = _.uniq(doc.usersLiveAnswering).length;
				if (doc.usersLiveAnswering.indexOf(self.userId) != -1) {
					doc.usersLiveAnsweringCount--;
				}
			}

			// Anonymity
			if (doc.isAnonymous) {
				delete doc.userId;
			}

			return doc;
		}

		self.ready();

		self.onStop(function () {
			handle.stop();
		});

	}
});

Meteor.publish('singlePost', function(id) {
	var post = Posts.find({_id: id, isDeleted: { $ne: true}},{fields: {userId: 0, upvoters: 0, followers: 0, viewers: 0, usersLiveAnswering: 0, revisionHistory: 0}});
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

		var self = this;
		var cursor = Answers.find({'postId': postId, isDeleted: {$ne: true}},{fields: {revisionHistory: 0}},{sort: {isInstructor: -1, isInstructorUpvoted: -1, voteCount: -1, createdAt: 1}});

		var handle = cursor.observeChanges({
			added: function (id, doc) {
				var d = checkFields(doc);
				self.added("answers", id, d);
			},
			changed: function(id, doc) {
				var d = checkFields(doc);
				self.changed("answers", id, d);
			},
			removed: function (id) {
				self.removed("answers", id);
			}
		});

		function checkFields(doc) {
			//Upvoters
			if (doc.upvoters) {
				if (doc.upvoters.indexOf(self.userId) != -1) {
					doc.upvoters = [self.userId];
				} else {
					doc.upvoters = [];
				}
			}

			// Anonymity
			if (doc.isAnonymous) {
				delete doc.userId;
			}

			if (doc.comments) {
				doc.comments.forEach(function(comment){
		      if (comment.isAnonymous) {
		        delete comment.userId;
		      }
		    });
			}

			return doc;
		}

		self.ready();

		self.onStop(function () {
			handle.stop();
		});

	}
});

Meteor.publish("notifications", function(){
	var userNotifications = Notifications.find({"userId": this.userId});
	if(userNotifications){
		return userNotifications;
	}
});

// Course Stats publications

Meteor.publish("courseStats", function(courseId) {
	// online users
	Counts.publish(this, "onlineUsers",
		Meteor.users.find({
			'status.online':true,
			'profile.courses': courseId
		})
	);

	// online instructors
	Counts.publish(this, "onlineInstructors",
		Meteor.users.find({
			'status.online':true,
			'username': {
				$in: Courses.findOne({'_id': courseId}).instructors
			}
		})
	);

	// posts unread by user
	Counts.publish(this, "unreadPosts",
		Posts.find({
			'courseId': courseId,
			'viewers': {$ne: this.userId},
			'isDeleted': false
		})
	);

	// unanswered questions
	Counts.publish(this, "unansweredQuestions",
		Posts.find({
			'courseId': courseId,
			'answersCount': 0,
			'isDeleted': false,
			'isInstructorPost': {$exists: false}
		})
	);

	// total questions (excludes posts)
	Counts.publish(this, "totalQuestions",
		Posts.find({
			'courseId': courseId,
			'isDeleted': false,
			'isInstructorPost': {$exists: false}
		})
	);

	var allCoursePosts = Posts.find({
		'courseId': courseId,
		'isDeleted': false
	});

	// all posts
	Counts.publish(this, "totalPosts", allCoursePosts);

	// contributions (answers)
	Counts.publish(this, "contributions", allCoursePosts, { countFromField: 'answersCount' });

	//instructor answers
	Counts.publish(this, "instructorResponses",
		Answers.find({
			'postId': {
				$in: allCoursePosts.fetch().map( function(u) { return u._id ; } )
			},
			'isInstructor': true,
			'isDeleted': false
		})
	);

	// total response time in minutes (minutes)
	Counts.publish(this, "totalResponseTime",
		Posts.find({
			'courseId': courseId,
			'isDeleted': false,
			'isInstructorPost': {$exists: false},
			'responseTime': {$exists: true}
		}),
		{ countFromField: 'responseTime' }
	);

})

Meteor.publish("draft", function(id, type){
	if (type == "post") {
		var draft = Drafts.find({courseId: id, userId: this.userId, type: type});
		if(draft){
			return draft;
		}
	} else if (type == "answer") {
		var draft = Drafts.find({postId: id, userId: this.userId, type: type});
		if(draft){
			return draft;
		}
	}
});

// Meteor.startup(function () {
//   UploadServer.init({
//     tmpDir: process.env.PWD + '/.uploads/tmp',
//     uploadDir: process.env.PWD + '/.uploads/feedback',
//     checkCreateDirectories: true
//   })
// });
