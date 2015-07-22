Template.header.helpers({
	student: function () {
		var uun = Meteor.user().username;
		Meteor.subscribe("singleStudent", uun.toUpperCase());
		if (uun) {
			var s = Students.findOne({'STU_CODE': uun.toUpperCase()});
			return s;
		} else {
			throw new Meteor.Error('no-currentUser', 'There is no user logged in');
		}
	}
});