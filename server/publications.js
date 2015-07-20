Meteor.publish('posts', function(id) {
	return Posts.find({},{sort: {created_at: -1}});
});

Meteor.publish('singlePost', function(id) {
 	return Posts.find({_id: id});
});