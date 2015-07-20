Meteor.publish('posts', function(id) {
	return Posts.find({});
});

Meteor.publish('singlePost', function(id) {
 	return Posts.find({_id: id});
});