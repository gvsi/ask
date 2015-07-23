Meteor.publish('posts', function(id) {
	return Posts.find({course_id: id});
});

Meteor.publish('singlePost', function(id) {
 	return Posts.find({_id: id});
});

Meteor.publish('coursesForStudent', function (user_id) {
	var courses = Meteor.users.findOne({_id: user_id},{'profile.courses': true}).profile.courses;
	if (!courses) {
		throw new Meteor.Error("Student does not exist in database");
	}

	return Courses.find({'_id': {$in: courses}, 'year': '2014/5', $or: [{'semester':'SEM2'}, {'semester':'YR'}]});
})

Meteor.publish('singleStudent', function(uun) {
	return Students.find({'STU_CODE': uun.toUpperCase()});
})