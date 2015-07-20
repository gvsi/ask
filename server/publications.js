Meteor.publish('posts', function(id) {
	return Posts.find({course_id: id});
});

Meteor.publish('singlePost', function(id) {
 	return Posts.find({_id: id});
});