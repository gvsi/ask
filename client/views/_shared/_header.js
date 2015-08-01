Template.header.helpers({
	identiconHash: function() {
		return Package.sha.SHA256(Meteor.user()._id);
	}

});
