Meteor.publish('posts', function(courseId) {
	if (this.userId) {
		var self = this;
		var cursor = Posts.find({courseId: courseId, isDeleted: { $ne: true}},{fields: {revisionHistory: 0, type: 0, isDeleted: 0, responseTime: 0}},{sort: {createdAt: -1}});

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
	} else {
		throw new Meteor.Error('invalid-permission', 'You should be logged in to see this');
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
	} else {
		throw new Meteor.Error('invalid-user', 'This user does not exist');
	}
});

Meteor.publish('allCourses', function () {
	var user = Meteor.users.findOne({_id: this.userId}, {fields: {'profile.courses': 1}});

	//check if user is logged in
	if (user) {
		return Courses.find({},{fields: {'areTagsDefault': 0, 'tags': 0, 'instructors': 0}});
	} else {
		throw new Meteor.Error('invalid-user', 'This user does not exist');
	}
});

Meteor.publish('singleCourse', function (courseId) {
	return Courses.find({_id: courseId}, {fields: {courseCode: 1, name: 1, year: 1, semester: 1, instructors: 1}})
});

Meteor.publish('singleUser', function(id) {
	if (this.userId) {
		return Meteor.users.find({_id: id},{fields: {'profile.name': 1, 'profile.surname': 1, 'profile.image': 1}});
	} else {
		throw new Meteor.Error('invalid-permission', 'You should be logged in to see this');
	}
});

Meteor.publish('answers', function (postId) {
	if (this.userId) {
		var post = Posts.find({_id: postId, isDeleted: { $ne: true}});
		if(post){
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
		} else {
			throw new Meteor.Error('invalid-post', 'This post does not exist');
		}
	} else {
		throw new Meteor.Error('invalid-permission', 'You should be logged in to see this');
	}
});

Meteor.publish('liveAnswers', function (postId) {
	if (this.userId) {
		var self = this;

		var cursor = LiveAnswers.find({postId: postId});;

		var handle = cursor.observeChanges({
			added: function (id, doc) {
				var d = checkFields(doc);
				self.added("liveAnswers", id, d);
			},
			changed: function(id, doc) {
				var d = checkFields(doc);
				self.changed("liveAnswers", id, d);
			},
			removed: function (id) {
				self.removed("liveAnswers", id);
			}
		});

		function checkFields(doc) {
			//usersLiveAnswering
			if (doc.usersLiveAnswering) {
				doc.usersLiveAnsweringCount = _.uniq(doc.usersLiveAnswering).length;
				if (doc.usersLiveAnswering.indexOf(self.userId) != -1) {
					doc.usersLiveAnsweringCount--;
				}
				doc.usersLiveAnswering = _.reject(doc.usersLiveAnswering, function(userId){ return userId != self.userId; });
			}
			return doc;
		}

		self.ready();

		self.onStop(function () {
			handle.stop();
		});
	} else {
		throw new Meteor.Error('invalid-permission', 'You should be logged in to see this');
	}
});

Meteor.publish("notifications", function() {
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
Counts.publish(this, "answers", allCoursePosts, { countFromField: 'answersCount' });

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

Counts.publish(this, "thisWeekVisits",
Visits.find({
	'date': {
		$gte: moment().startOf('isoweek').toDate(),
		$lt: moment().toDate()
	},
	'course': courseId
},
{
	sort: {createdAt: -1}
}
)
);

for (var i = 0; i < 10; i++) {
	var date = moment().startOf("day").subtract(i, 'days');
	Counts.publish(this, "visitsOn-"+date.format("L"),
	Visits.find({'date': date.toDate(), 'course': courseId})
);
}

var instructors = Courses.findOne({'_id':courseId}).instructors;
var users = Meteor.users.find({'username': {$in: instructors}, 'status.online':true},{fields: {'username': 1, 'profile.name': 1, 'profile.surname': 1,'profile.image':1, 'status.online': 1}});
//console.log(users);
return users;

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
